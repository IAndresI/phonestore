const Router = require('express');
const router = new Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:id',authMiddleware, cartController.getCart)
router.post('/:id',authMiddleware, cartController.changeCart)
router.put('/:id',authMiddleware, cartController.changeCartItem)

module.exports = router;