const Router = require('express');
const router = new Router();
const emailController = require('../controllers/emailController');

router.post('/order/unregistred', emailController.sendOrderEmailToUnregistredUser)
router.post('/order/registred', emailController.sendOrderEmailToRegistredUser)

module.exports = router;