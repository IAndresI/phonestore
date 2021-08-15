const db = require('../db');
const ApiError = require('../error/ApiError');

class AdminController {

  async getDashboardCounts(req, res, next) { 
    try {

      const qeury = await db.query(`SELECT * FROM get_dashboard_counts();`);

      const data = qeury.rows[0]

      return res.json(data)
    }
    catch(err) {
      next(ApiError.badRequest(err.message));
    }
  }
}

module.exports = new AdminController();
