const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const phoneRouter = require('./phoneRouter');
const manufacturerRouter = require('./manufacturerRouter');
const cartRouter = require('./cartRouter');
const orderRouter = require('./orderRouter');
const paypalRouter = require('./paypalRouter');
const emailRouter = require('./emailRouter');
const adminRouter = require('./adminRouter');

router.use('/email', emailRouter)
router.use('/paypal', paypalRouter)
router.use('/phone', phoneRouter)
router.use('/manufacturer', manufacturerRouter)
router.use('/cart', cartRouter)
router.use('/user', userRouter)
router.use('/admin', adminRouter)
router.use('/order', orderRouter)

module.exports = router;