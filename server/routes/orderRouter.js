const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',orderController.create)
router.get('/',orderController.getAll)
router.get('/:id',orderController.getOne)
router.get('/client/:id',orderController.getUserOrders)
router.get('/history/:id',orderController.getHistory)
router.get('/details/:id',orderController.getOrderDetails)
router.delete('/:id',orderController.removeOrder)
router.put('/status/:id', orderController.changeOrderStatus)

module.exports = router;