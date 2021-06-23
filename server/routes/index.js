const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const phoneRouter = require('./phoneRouter');
const manufacturerRouter = require('./manufacturerRouter');
const cartRouter = require('./cartRouter');
router.use('/user', userRouter)
router.use('/phone', phoneRouter)
router.use('/manufacturer', manufacturerRouter)
router.use('/cart', cartRouter)
// router.use('/order')

module.exports = router;