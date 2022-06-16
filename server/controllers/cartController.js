const db = require('../db');
const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');

class CartController {
  async getCart(req, res, next) {
    try {
      const {id} = req.params;
      if(!id) {
        return next(ApiError.badRequest('Enter ID!'))
      }
      const qeury = await db.query(`
      SELECT ph.phone_id,ph.name,ph.price,cart_det.count, ph.image, col.color_id, col.name, col.code
      FROM cart_details cart_det 
      INNER JOIN phone ph ON ph.phone_id=cart_det.phone_id 
  INNER JOIN color col ON col.color_id=cart_det.color_id
      WHERE cart_id=$1;`, 
        [id]);
      const data = qeury.rows

      for (let i = 0; i < data.length; i++) {
        const qeuryAviableCount = await db.query(`
          SELECT "count" FROM color_details WHERE color_id=$1 AND phone_id=$2;`, 
        [data[i].color_id, data[i].phone_id]);
        data[i].inStock = qeuryAviableCount.rows[0].count;
      }


      return res.json(data)
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async changeCart(req, res,next) {
    try {
      const {id} = req.params;
      const {phoneId, colorId, actionType} = req.body;
      const count = req.body.count;
      const qeury = await db.query(`call change_cart(${id}, ${phoneId}, ${colorId}, '${actionType}' ${count ? `, ${count}` : ''});`,
        (err, response) => {
          if(err) {
            next(ApiError.badRequest(err.message));
          }
          else {
            return res.status(200).json({message: "Successfull!"})
          }
        }
      );
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getPaymentMethod(req, res, next) {
    try {
      const query = await db.query('SELECT * FROM payment_method');
      const data = query.rows;
      return res.json(data)
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getLocations(req, res, next) {
    try {
      const query = await db.query('SELECT * FROM pickup_point');
      const data = query.rows;
      return res.json(data)
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }
}

module.exports = new CartController();