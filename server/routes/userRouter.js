const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/all', userController.getAllUsers)
router.post('/registration',userController.create)
router.get('/is_already_registred',userController.isAlreadyRegistred)
router.post('/registration/empty',userController.createEmpty)
router.post('/login',userController.login)
router.get('/password_check',userController.checkPassword)
router.put('/password_change',userController.changePassword)
router.delete('/:id', authMiddleware, userController.deleteUser)
router.get('/auth', authMiddleware, userController.auth)
router.get('/profile', authMiddleware, userController.getProfile)
router.put('/role/:id', authMiddleware, userController.changeUserRole)
router.put('/profile', authMiddleware, userController.putProfile)

module.exports = router;