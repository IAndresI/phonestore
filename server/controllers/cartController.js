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
        SELECT ph.phone_id,ph.name,ph.price,cart_det.count, ph.image, (SELECT array_agg(ARRAY[col.color_id::TEXT, col.name::TEXT, col.code::TEXT]) FROM color col where col.color_id=cart_det.color_id) as "selectedColor" 
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

  async changeCartItem(req, res,next) {
    try {
      const qeury = await db.query('SELECT MAX(price) FROM phone');
      const [{max}] = qeury.rows
      return res.json(max)
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async changeCart(req, res,next) {
    try {
      const qeury = await db.query('SELECT MAX(price) FROM phone');
      const [{max}] = qeury.rows
      return res.json(max)
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