const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const phoneRouter = require('./phoneRouter');
const manufacturerRouter = require('./manufacturerRouter');

router.use('/user', userRouter)
router.use('/phone', phoneRouter)
router.use('/manufacturer', manufacturerRouter)
// router.use('/cart')
// router.use('/order')

module.exports = router;