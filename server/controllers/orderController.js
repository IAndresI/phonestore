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

  async getUserOrders(req, res, next) {
    try {

      const {page, limit} = req.query;
      const offset = page*limit;

      const {id} = req.params;
      if(!id) {
        return next(ApiError.badRequest('Enter ID!'))
      } 
    
      const dataQuery = await db.query('SELECT * FROM get_all_user_orders WHERE client_id=$1 LIMIT $2 OFFSET $3;', [id, limit, offset]);
      const countQuery = await db.query('SELECT COUNT(*) FROM get_all_user_orders WHERE client_id=$1;', [id]);
      return res.json({count: countQuery.rows[0].count,orders: dataQuery.rows})
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
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
      const orderInfo = await db.query('SELECT * FROM order_info WHERE order_id=$1;', [id]);
      const orderDetailsInfo = await db.query(`
        SELECT ph.phone_id,
        ph.name,
        ph.price,
        ph.image,
        ord_det.count
    
        FROM order_details ord_det
        JOIN phone ph ON ph.phone_id = ord_det.phone_id 
        WHERE ord_det.order_id=$1;`,
        [id]
      );
      return res.json({orderInfo: orderInfo.rows[0], orderDetailsInfo: orderDetailsInfo.rows})
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }
}

module.exports = new OrderController();
