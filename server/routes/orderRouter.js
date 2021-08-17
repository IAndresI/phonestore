const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');

router.post('/',orderController.create)
router.get('/',orderController.getAll)
router.get('/:id',orderController.getOne)
router.get('/client/:id',orderController.getUserOrders)
router.get('/history/:id',orderController.getHistory)
router.get('/details/:id',orderController.getOrderDetails)

module.exports = router;