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
    const page = +req.query.page;
    const limit = +req.query.limit
    const offset = limit*(page+1)-limit;
    try {
      const dataQuery = await db.query('SELECT * FROM order_preview LIMIT $1 OFFSET $2;', [limit, offset]);
      const countQuery = await db.query('SELECT COUNT(order_id) FROM order_preview;');
      const data = dataQuery.rows;
      const {count} = countQuery.rows[0];
      return res.json({data, count})
    }
    catch(err) {
      return next(ApiError.badRequest(err.message));
    }
  }

  async getOrderDetails(req, res, next) {
    try {
      const {id} = req.params;
      if(!id) {
        return next(ApiError.badRequest('Enter ID!'))
      }
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
      const data = orderDetailsInfo.rows
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
      const orderDetailsInfo = await await db.query(`
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

  async getHistory(req, res) {
    try {
      const {id} = req.params;
      if(!id) {
        return next(ApiError.badRequest('Enter ID!'))
      }
      const query = await db.query(`SELECT * FROM get_order_history($1)`, [id])
      const data = query.rows;
      return res.json(data)
    }
    catch(err) {
      return next(new ApiError.badRequest(err.message));
    }
  }

  async changeOrderStatus(req, res, next) { 
    try {

      const { id } = req.params;

      const {prevStatus, newStatus } = req.body;

      await db.query(`UPDATE order_status SET ${prevStatus} = false, ${newStatus} = true WHERE order_id=${id};`);

      return res.json({message: "Status successfully changed!"})
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async removeOrder(req, res, next) { 
    try {

      const { id } = req.params;

      await db.query(`DELETE FROM "order" WHERE order_id=${id};`);

      return res.json({message: "Order successfully removed!"})
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }
}



module.exports = new OrderController();
