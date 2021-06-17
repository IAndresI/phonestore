const ApiError = require('../error/ApiError');

class UserController {
  async registration(req, res) {

  }

  async login(req, res) {
    
  }

  async auth(req, res, next) {
    const {id} = req.query;
    if(!id) {
      return next(ApiError.badRequest('Enter ID!'))
    }
    res.json(query)
  }
}

module.exports = new UserController();