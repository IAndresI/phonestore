const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/registration',userController.create)
router.post('/login',userController.login)
router.get('/auth', authMiddleware, userController.auth)

module.exports = router;