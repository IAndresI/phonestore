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
    const qeury = await db.query('SELECT ph.*,manuf.name as "manufacturer" FROM phone ph INNER JOIN manufacturer manuf ON manuf.manufacturer_id=ph.manufacturer_id WHERE phone_id=$1', [id]);
    const data = qeury.rows[0]
    return res.json(data)
  }

  async getAll(req, res,next) {
    try {
      const {page, limit, sort, color, manufacturers, price} = req.query;
      const offset = page*limit-limit;
      const orderBy = `${sort ? `ORDER BY ph.price ${sort}` : ""}`;
      const whereColor = color ? `AND col_det.color_id IN(${color.join(',')})` : "";
      const whereManufacturer = manufacturers ? `AND ph.manufacturer_id IN(${manufacturers.join(',')})` : "";
      const wherePrice = price ? `AND ph.price > ${price[0]}::money AND ph.price < ${price[1]}::money` : "";

      //console.log(`SELECT ph.* FROM phone ph INNER JOIN color_details col_det ON col_det.phone_id=ph.phone_id WHERE TRUE ${whereColor} ${whereManufacturer} ${wherePrice} GROUP BY ph.phone_id ${orderBy} LIMIT ${limit} OFFSET ${offset};`);

      const qeury = await db.query(`SELECT ph.* FROM phone ph INNER JOIN color_details col_det ON col_det.phone_id=ph.phone_id WHERE TRUE ${whereColor} ${whereManufacturer} ${wherePrice} GROUP BY ph.phone_id ${orderBy} LIMIT ${limit} OFFSET ${offset};`);
      const countQeury = await db.query(`SELECT COUNT(*) FROM phone ph INNER JOIN color_details col_det ON col_det.phone_id=ph.phone_id WHERE TRUE ${whereColor} ${whereManufacturer} ${wherePrice} GROUP BY ph.phone_id;`);
      return res.json({count: countQeury.rows.length,phones: qeury.rows})
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
    
  }

  async getMinMaxPirce(req, res,next) {
    try {
      const qeury = await db.query('select * from get_min_max_price();');
      const [data] = qeury.rows
      return res.json(data);
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getAllColors(req, res,next) {
    try {
      const qeury = await db.query('select * from color;');
      const data = qeury.rows
      return res.json(data);
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async create(req, res, next) {
    try {
      const {name, weight, diagonal, ram, memory, price, manufacturer_id, color, camera} = req.body;
      let img;
      let filename = null;
      if(req.files) {
        img = req.files.img;
        filename = uuid.v4()+ ".jpg";
      }
      
      const qeury = await db.query(`INSERT INTO 
        public.phone( weight, diagonal, ram, memory, price, manufacturer_id, name, color, camera, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`, [weight, diagonal, ram, memory, price, manufacturer_id, name, color, camera, filename], (err) => {
          if(!err) {
            if(filename)img.mv(path.resolve(__dirname, '..','static', filename));
            return res.json(req.body);
          }
          return next(ApiError.badRequest(err));
        });
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }
}

module.exports = new PhoneController();