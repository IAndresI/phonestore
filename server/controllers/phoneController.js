const db = require('../db');
const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');

class PhoneController {
  async getOne(req, res, next) {
    const {id} = req.params;
    if(!id) {
      return next(ApiError.badRequest('Enter ID!'))
    }
    const qeury = await db.query('SELECT * FROM phone WHERE phone_id=$1', [id]);
    const data = qeury.rows[0]
    return res.json(data)
  }

  async getAll(req, res,next) {
    try {
      const qeury = await db.query('SELECT * FROM phone');
      const data = qeury.rows
      return res.json(data)
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
    
  }

  async create(req, res, next) {
    try {
      const {name, weight, diagonal, ram, memory, price, manufacturer_id, color, camera} = req.body;
      let img;
      let filename = null;
      if(req.files) {
        img = req.files.img;
        filename = uuid.v4()+ ".jpg"
      }
      
      const qeury = await db.query(`INSERT INTO 
        public.phone( weight, diagonal, ram, memory, price, manufacturer_id, name, color, camera, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`, [weight, diagonal, ram, memory, price, manufacturer_id, name, color, camera, filename], (err, res) => {
          if(!err) {
            if(filename)img.mv(path.resolve(__dirname, '..','static', filename))
            return res.json(req.body)
          }
          next(ApiError.badRequest(err));
          return res.status(500)
        });
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }
}

module.exports = new PhoneController();