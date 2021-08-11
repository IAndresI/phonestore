const db = require('../db');
const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');

class PhoneController {

  async getSeveral(req, res, next) {
    const {id} = req.query;
    const qeury = await db.query(`SELECT * FROM get_several_phones(ARRAY[$1::int[]]);`, [id]);
    const data = qeury.rows
    return res.json(data)
  }

  async getOne(req, res, next) {
    const {id} = req.params;
    if(!id) {
      return next(ApiError.badRequest('Enter ID!'));
    }
    const qeury = await db.query('SELECT ph.*,manuf.name as "manufacturer", get_all_phone_colors(ph.phone_id) AS "colors" FROM phone ph INNER JOIN manufacturer manuf ON manuf.manufacturer_id=ph.manufacturer_id WHERE phone_id=$1', [id]);
    const data = qeury.rows[0];
    return data ? res.json(data) : next(ApiError.badRequest('Nothings found'));
  }

  async getReviews(req, res,next) {
    try {
      const {id} = req.params;
      const {limit, page, clientId} = req.query;
      if(!id) {
        return next(ApiError.badRequest('Enter ID!'));
      }

      const offset = page*limit-limit;
      const otherClientReviewsQuery = await db.query(`SELECT * FROM get_other_phone_reviews($1, $2, $3, $4);`, [id, clientId, limit, offset]);
      const clientReviewsQuery = await db.query(`SELECT * FROM get_client_phone_reviews($1, $2);`, [id, clientId]);
      const overallCountQuery = await db.query(`SELECT COUNT(*) FROM get_phone_reviews($1);`, [id]);
      const otherClientReview = otherClientReviewsQuery.rows;
      const clientReview = clientReviewsQuery.rows[0];
      const {count} = overallCountQuery.rows[0];
      return res.json({otherClientReview,clientReview, count});
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async createReview(req, res,next) {
    try {
      const {id} = req.params;
      const {clientId, rating, comment} = req.body;
      if(!clientId) {
        return next(ApiError.badRequest('Please, login before make review!'));
      }
      await db.query(`INSERT INTO 
        review( phone_id, client_id, rating, text)
        VALUES ($1, $2, $3, $4);`, [id, clientId, rating, comment], (err) => {
          if(!err) {
            return res.status(201).json({message:"Successfully created"});;
          }
          else {
            if(err.code === '23505') {
              return next(ApiError.duplicateError(err.message));
            }
            else return next(ApiError.badRequest(err.message));
          }
        });
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async editReview(req, res,next) {
    try {
      const {id} = req.params;
      const {rating, comment} = req.body;
      if(!id) {
        return next(ApiError.badRequest('Review Not Found'));
      }
      await db.query(`UPDATE review SET rating=$1, "text"=$2, verified=false WHERE review_id=$3`, [rating, comment, id], (err) => {
          if(!err) {
            return res.status(201).json({message:"Successfully edited"});;
          }
          else return next(ApiError.badRequest(err));
        });
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getAll(req, res,next) {
    try {
      const {page, limit, sort, color, manufacturers, price, ram,rom,camera, diagonal} = req.query;
      const offset = page*limit-limit;
      const orderByArr = sort.split(' ')
      const orderBy = `${sort ? `ORDER BY ph.${orderByArr[0]} ${orderByArr[1]}` : ""}`;
      const whereColor = color ? `AND col_det.color_id IN(${color.join(',')})` : "";
      const whereManufacturer = manufacturers ? `AND ph.manufacturer_name IN(${manufacturers.map(e=>`'${e}'`).join(',')})` : "";
      const wherePrice = price ? `AND ph.price >= ${price[0]}::money AND ph.price <= ${price[1]}::money` : "";
      const whereRam = ram ? `AND ph.ram IN(${ram.join(',')})` : "";
      const whereRom = rom ? `AND ph.memory IN(${rom.join(',')})` : "";
      const whereCamera = camera ? `AND cardinality(ph.camera) IN(${camera.join(',')})` : "";
      const whereDiagonal = diagonal ? `AND ph.diagonal>=${diagonal[0]} AND ph.diagonal<=${diagonal[1]}` : "";

      // console.log(`SELECT DISTINCT ph.phone_id, ph.price, ph.manufacturer_name, ph.phone_name, ph.image, ph.rating, ph.review_count, get_all_phone_colors(ph.phone_id) AS "phone_colors"
      // FROM get_full_phones ph 
      // LEFT JOIN color_details col_det ON col_det.phone_id=ph.phone_id 
      // LEFT JOIN color col ON col_det.color_id=col.color_id 
      // WHERE TRUE ${whereColor} ${whereManufacturer} ${wherePrice} ${whereRam} ${whereRom} ${whereCamera} ${whereDiagonal}
      // ${orderBy} 
      // LIMIT ${limit} OFFSET ${offset}`);

      const qeury = await db.query(`
        SELECT DISTINCT ph.phone_id, ph.price, ph.manufacturer_name, ph.phone_name, ph.image, ph.rating, ph.review_count, get_all_phone_colors(ph.phone_id) AS "phone_colors"
        FROM get_full_phones ph 
        LEFT JOIN color_details col_det ON col_det.phone_id=ph.phone_id 
        LEFT JOIN color col ON col_det.color_id=col.color_id 
        WHERE TRUE ${whereColor} ${whereManufacturer} ${wherePrice} ${whereRam} ${whereRom} ${whereCamera} ${whereDiagonal}
        ${orderBy} 
        LIMIT ${limit} OFFSET ${offset};
      `);
      
      const countQeury = await db.query(`
        SELECT COUNT(ph.phone_id) 
        FROM get_full_phones ph 
        LEFT JOIN color_details col_det ON col_det.phone_id=ph.phone_id 
        LEFT JOIN color col ON col_det.color_id=col.color_id 
        WHERE TRUE ${whereColor} ${whereManufacturer} ${wherePrice} ${whereRam} ${whereRom} ${whereCamera} ${whereDiagonal}
        GROUP BY ph.phone_id;
      `);

      return res.json({count: countQeury.rows.length,phones: qeury.rows})
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async search(req, res,next) {
    try {
      const {searchText, limit, page} = req.query;
      const offset = page*limit-limit;
      const qeury = await db.query(`
        select * from get_full_phones 
        WHERE lower(phone_name) LIKE '%${searchText}%' 
        OR lower(manufacturer_name) LIKE '%${searchText}%' 
        LIMIT ${limit} OFFSET ${offset};`);
      const countQeury = await db.query(`
        SELECT COUNT(*) FROM get_full_phones 
        WHERE lower(phone_name) LIKE '%${searchText}%' 
        OR lower(manufacturer_name) LIKE '%${searchText}%'
        GROUP BY phone_id;
      `);
      return res.json({count: countQeury.rows.length,phones: qeury.rows})
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getNewest(req, res,next) {
    try {
      const qeury = await db.query(`select * FROM newest_phones;`);
      const data = qeury.rows
      return res.json(data)
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getMinMaxPirce(req, res,next) {
    try {
      const qeury = await db.query('select * from get_min_max_price();');
      const [data] = qeury.rows
      return data
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getMinMaxDiagonal(req, res,next) {
    try {
      const qeury = await db.query('select * from get_min_max_diagonal();');
      const [data] = qeury.rows
      return data
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getAllRam(req, res,next) {
    try {
      const qeury = await db.query('select * from get_all_ram;');
      const data = qeury.rows
      return data
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getAllMemory(req, res,next) {
    try {
      const qeury = await db.query('select * from get_all_memory;');
      const data = qeury.rows
      return data
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getAllManufacturer(req, res,next) {
    try {
      const qeury = await db.query('select * from manufacturer;');
      const data = qeury.rows
      return data
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getAllCameraCount(req, res,next) {
    try {
      const qeury = await db.query('select * from get_all_camera_count;');
      const data = qeury.rows
      //return res.json(data);
      return data
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getAllColors(req, res,next) {
    try {
      const qeury = await db.query('select * from color;');
      const data = qeury.rows;
      //return res.json(data);
      return data
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  getAllFilter = async (req, res,next) => {
    try {
      const allColors = await this.getAllColors(req, res,next);
      const allManufacturer = await this.getAllManufacturer(req, res,next);
      const minMaxPirce = await this.getMinMaxPirce(req, res,next);
      const minMaxDiagonal = await this.getMinMaxDiagonal(req, res,next);
      const allCameraCount = await this.getAllCameraCount(req, res,next);
      const allMemory = await this.getAllMemory(req, res,next);
      const getAllRam = await this.getAllRam(req, res,next)
      return res.json({
          color: allColors,
          price: minMaxPirce,
          manufacturer: allManufacturer,
          diagonal: minMaxDiagonal,
          camera: allCameraCount, 
          memory: allMemory,
          ram: getAllRam
        }
      )
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