const db = require('../db');
class ManufacturerController {
  async create(req, res) { 
    const query = await db.query(`INSERT INTO 
      public.manufacturer (name, director, phone, inn, address, link)
      VALUES ('Asus', 'Johan Cruyff', '89117854994', 7854968574, 'St. Peterdburb, Avangardnaya, 12', 'phoneTop.com');`
    );
    return res.json(query)
  }
  async getAll(req, res) {
    const query = await db.query('SELECT * FROM manufacturer');
    const data = query.rows;
    return res.json(data)
  }
  async getOne(req, res) {
    const {id} = req.params;
    if(!id) {
      return next(ApiError.badRequest('Enter ID!'))
    }
    const query = await db.query('SELECT * FROM manufacturer WHERE manufacturer_id=$1', [id]);
    const data = query.rows;
    return res.json(data)
  }
}

module.exports = new ManufacturerController();
