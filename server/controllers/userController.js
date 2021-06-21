const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateJwt(id, email) {
  return jwt.sign(
    {id, email}, 
    process.env.SECRET_KEY, 
    {expiresIn: '24h'}
  )
}

class UserController {
  async create(req, res, next) {
    try {
      const {password, date_of_birth, email, phone, first_name, last_name, gender} = req.body;
      let img;
      let filename = null;
      if(req.files) {
        img = req.files.img;
        filename = uuid.v4()+ ".jpg"
      }

      const hashedPassword = await bcrypt.hash(password, 5)
      
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
      const qeury = await db.query(`SELECT password FROM client WHERE email=$1`,[email], async (err,resp) => {
        client=resp.rows[0];
        if(bcrypt.compareSync(password, client.password ? client.password : null )) {
          const token = generateJwt(client.client_id, client.email)
          return res.json({token})
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
    const {id} = req.query;
    if(!id) {
      return next(ApiError.badRequest('Enter ID!'))
    }
    res.json(query)
  }
}

module.exports = new UserController();