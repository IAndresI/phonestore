const Router = require('express');
const router = new Router();

router.get('/config', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

module.exports = router;