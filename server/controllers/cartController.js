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
        SELECT ph.phone_id,ph.name,ph.price,cart_det.count, ph.image, 
          (SELECT array_agg(ARRAY[col.color_id::TEXT, col.name::TEXT, col.code::TEXT, col_det.count::TEXT]) FROM color col
          INNER JOIN color_details col_det ON col.color_id=col_det.color_id where col.color_id=cart_det.color_id) as "selectedColor" 
        FROM cart_details cart_det 
        INNER JOIN phone ph ON ph.phone_id=cart_det.phone_id 
        WHERE cart_id=$1`, 
        [id]);
      const data = qeury.rows
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
            console.log({...err});
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