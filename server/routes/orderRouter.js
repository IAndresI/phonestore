const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');

router.post('/',orderController.create)
router.get('/',orderController.getAll)
router.get('/:id',orderController.getOne)
router.get('/client/:id',orderController.getUserOrders)

module.exports = router;