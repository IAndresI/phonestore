const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/registration',userController.create)
router.post('/registration/empty',userController.createEmpty)
router.post('/login',userController.login)
router.get('/auth', authMiddleware, userController.auth)
router.get('/profile/:id', authMiddleware, userController.getProfile)
router.put('/profile/:id', authMiddleware, userController.putProfile)

module.exports = router;