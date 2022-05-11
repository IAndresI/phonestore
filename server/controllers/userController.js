const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateJwt(userData) {
  return jwt.sign(
    userData, 
    process.env.SECRET_KEY, 
    {expiresIn: '24h'}
  )
}

class UserController {

  async auth(req, res, next) {
    const { id, email, cart_id, role } = req.user;
    const token = generateJwt({id, email, cart_id, role})
    res.json({token})
  }

  async create(req, res, next) {
    try {
      const {password, date_of_birth, email, phone, first_name, last_name, gender} = req.body;
      const hashedPassword = await bcrypt.hash(password, 5)
      let img;
      let filename = null;
      if(req.files) {
        img = req.files.image;
        filename = uuid.v4()+ ".jpg"
      }
      
      const qeury = await db.query(`INSERT INTO public.client(
        password, date_of_birth, email, phone, first_name, last_name, gender, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`, [hashedPassword, date_of_birth, email, phone, first_name, last_name, gender, filename], (err) => {
          if(!err) {
            if(filename)img.mv(path.resolve(__dirname, '..','static', filename))
            return res.json(req.body)
          }
          next(ApiError.badRequest(err));
          return res.status(500)
        })
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }
  
  async createEmpty(req, res, next) {
    try {
      const { email, firstName, lastName, phone=null } = req.body;

      const randomPassword = Math.random().toString(36).slice(2);
      const hashedPassword = await bcrypt.hash(randomPassword, 5)

      const qeury = await db.query(
        `SELECT create_empty_client AS "client_id" FROM create_empty_client($1, $2, $3, $4, $5);`, 
        [hashedPassword, email, firstName, lastName, phone],
        (err, response) => {
          if(err) {
            if(err.code==="23505") next(ApiError.duplicateError("This email already exists! Please, login before creating order!"));
            else next(ApiError.badRequest(err.message));
          }
          else {
            const [data] = response.rows
            return res.json(data)
          }
        }
      )
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      let client;
      const qeury = await db.query(`SELECT a.password,a.email,a.client_id,a.role, b.cart_id FROM client a INNER JOIN cart b ON b.client_id=a.client_id WHERE a.email=$1`,[email], async (err,resp) => {
        if(err) {
          console.log(err);
          next(ApiError.internalError(err.message))
        }
        if(resp.rows[0]) {
          client=resp.rows[0];
          if(bcrypt.compareSync(password, client.password || undefined)) {
            const {client_id, email, cart_id, role} = client;
            const token = generateJwt({id: client_id, email, cart_id, role})
            return res.json({token})
          }
          else {
            return next(ApiError.internalError('Incorrect email or password!'))
          }
        }
        else {
          return next(ApiError.internalError('Incorrect email or password!'))
        }
      });
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async getProfile(req, res, next) {
    try {
      const {id} = req.query;
      if(!id) {
        return next(ApiError.badRequest('Enter ID!'))
      }
      const qeury = await db.query('SELECT * FROM client WHERE client_id=$1', [id]);
      const [data] = qeury.rows
      return res.json(data)
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async putProfile(req, res, next) {
    try {
      const {clientId, date_of_birth, email, first_name, last_name, gender, image} = req.body;

      if(!clientId) {
        return next(ApiError.badRequest('Enter ID!'))
      }

      let img;
      let filename = null;
      if(req.files) {
        img = req.files.image;
        filename = uuid.v4()+ ".jpg"
      }
      else img=image;
      
      const qeury = await db.query(`
        UPDATE client 
        SET first_name = $1, last_name = $2, email = $3, gender = $4, date_of_birth = $5 ${filename ? `, image = '${filename}'` : ""} 
        WHERE client_id=$6`, 
        [first_name, last_name, email, gender, date_of_birth, clientId], 
        (err) => {
          if(!err) {
            if(filename)img.mv(path.resolve(__dirname, '..','static', filename))
            return res.json(req.body)
          }
          next(ApiError.badRequest(err));
          return res.status(500)
        })
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async isAlreadyRegistred(req, res, next) {
    try {
      const {email} = req.query;
      if(!email) {
        return next(ApiError.badRequest('Enter email!'))
      }
      const qeury = await db.query(`SELECT client_id FROM client WHERE email=$1;`, [email]);
      const [data] = qeury.rows
      return res.json(!!data)
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async checkPassword(req, res, next) {
    try {
      const {password, clientId} = req.query;
      await db.query(
        `SELECT password FROM client WHERE client_id=$1;`, 
        [clientId],
        (err, response) => {
          if(err) return next(ApiError.badRequest(err.message));
          else {
            if (response.rows.length > 0) return res.json(bcrypt.compareSync(password, response.rows[0]?.password || undefined))
            else res.json(false)
          }
        }
      );
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async changePassword(req, res, next) {
    try {
      const {password, clientId} = req.body;
      if(!password || !clientId) {
        next(ApiError.badRequest('Email or Password not entered!'));
      }
      const hashedPassword = await bcrypt.hash(password, 5)
      const qeury = await db.query(`UPDATE client SET password=$1 WHERE client_id=$2;`, [hashedPassword, clientId]);
      const [data] = qeury.rows
      return res.json(data)
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const page = +req.query.page;
      const limit = +req.query.limit
      const offset = limit*(page+1)-limit;

      const dataQuery = await db.query('SELECT client_id, image, first_name, last_name, email, role FROM client ORDER BY date_registred DESC LIMIT $1 OFFSET $2;', [limit, offset])
      const countQuery = await db.query('SELECT COUNT(client_id) FROM client;');
      const data = dataQuery.rows;
      const {count} = countQuery.rows[0];
      return res.json({data, count})
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async changeUserRole(req, res, next) { 
    try {

      const { id } = req.params;

      const { newRole } = req.body;

      await db.query(`UPDATE client SET role=$1 WHERE client_id=$2;`, [newRole, id]);

      return res.json({message: "Status successfully changed!"})
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async deleteUser(req, res, next) { 
    try {

      const { id } = req.params;

      await db.query('DELETE FROM client WHERE client_id=$1;', [id]);

      return res.json({message: "Client successfully deleted!"})
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

}

module.exports = new UserController();