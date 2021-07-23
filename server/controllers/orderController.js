const db = require('../db');
const ApiError = require('../error/ApiError');

class OrderController {
  async create(req, res, next) { 
    try {

      const {clientId, dateOrderPaid, total, paymentMethod, pickupPoint, deliveryAddress, items } = req.body;

      await db.query(
        `call create_order(
          ($1, $2, $3::money, $4, $5, $6),
          ARRAY[$7::int[]]
        );`,
        [clientId, dateOrderPaid, total, paymentMethod,pickupPoint, deliveryAddress, items],
        (err, response) => {
          if(err) next(ApiError.badRequest(err))
          else return res.json(response.rows[0].returning_order_id)
        }
      );
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
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
