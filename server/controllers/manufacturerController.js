const db = require('../db');
const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');
class ManufacturerController {
  async create(req, res, next) { 
    try {
      const {name, director, phone, inn, address, link} = req.body;
      let img;
      let filename = null;
      if(req.files) {
        img = req.files.img;
        filename = uuid.v4()+ ".jpg"
      }
      
      const qeury = await db.query(`INSERT INTO 
        public.manufacturer (name, director, phone, inn, address, link, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7);`, [name, director, phone, inn, address, link, filename], (err, res) => {
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
  async getAll(req, res, next) {
    try {
      const query = await db.query('SELECT * FROM manufacturer');
      const data = query.rows;
      return res.json(data)
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }
  async getOne(req, res, next) {
    const {id} = req.params;
    if(!id) {
      return next(ApiError.badRequest('Enter ID!'))
    }
    const query = await db.query('SELECT * FROM manufacturer WHERE manufacturer_id=$1', [id]);
    const data = query.rows;
    return res.json(data)
  }
}

module.exports = new ManufacturerController();
