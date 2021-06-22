const db = require('../db');
const uuid = require('uuid');
const path = require('path');
const ApiError = require('../error/ApiError');

class CartController {
  async getCart(req, res, next) {
    const {id} = req.params;
    if(!id) {
      return next(ApiError.badRequest('Enter ID!'))
    }
    const qeury = await db.query('SELECT * FROM cart_details WHERE cart_id=$1', [id]);
    const data = qeury.rows
    return res.json(data)
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
}

module.exports = new CartController();