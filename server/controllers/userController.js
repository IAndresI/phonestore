const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateJwt(id, email, cart_id) {
  return jwt.sign(
    {id, email, cart_id}, 
    process.env.SECRET_KEY, 
    {expiresIn: '24h'}
  )
}

class UserController {
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

  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      let client;
      const qeury = await db.query(`SELECT a.password,a.email,a.client_id,b.cart_id FROM client a INNER JOIN cart b ON b.client_id=a.client_id WHERE a.email=$1`,[email], async (err,resp) => {
        if(err) return next(ApiError.internalError('Incorrect'))
        if(resp.rows[0]) {
          client=resp.rows[0];
          if(bcrypt.compareSync(password, client.password || undefined)) {
            const token = generateJwt(client.client_id, client.email, client.cart_id)
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

  async auth(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.cart_id)
    res.json({token})
  }

  async getProfile(req, res, next) {
    try {
      const {id} = req.params;
      if(!id) {
        return next(ApiError.badRequest('Enter ID!'))
      }
      const qeury = await db.query('SELECT * FROM client WHERE client_id=$1', [id]);
      const data = qeury.rows
      return res.json(data)
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }
}

module.exports = new UserController();