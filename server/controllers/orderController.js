const db = require('../db');
const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');

class OrderController {
  async create(req, res, next) { 
    // try {
    //   const {name, director, phone, inn, address, link} = req.body;
    //   let img;
    //   let filename = null;
    //   if(req.files) {
    //     img = req.files.img;
    //     filename = uuid.v4()+ ".jpg"
    //   }
      
    //   const qeury = await db.query(`INSERT INTO 
    //     public.order (name, director, phone, inn, address, link, image)
    //     VALUES ($1, $2, $3, $4, $5, $6, $7);`, [name, director, phone, inn, address, link, filename], (err, res) => {
    //       if(!err) {
    //         if(filename)img.mv(path.resolve(__dirname, '..','static', filename))
    //         return res.json(req.body)
    //       }
    //       return next(ApiError.badRequest(err));
    //     });
    // }
    // catch(err) {
    //   next(ApiError.badRequest(err.message));
    // }
  }

  async getAll(req, res, next) {
    try {
      const query = await db.query('SELECT * FROM order');
      const data = query.rows;
      return res.json(data)
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const {id} = req.params;
      if(!id) {
        return next(ApiError.badRequest('Enter ID!'))
      }
      const query = await db.query('SELECT * FROM order WHERE order_id=$1', [id]);
      const data = query.rows;
      return res.json(data)
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }
}

module.exports = new OrderController();
