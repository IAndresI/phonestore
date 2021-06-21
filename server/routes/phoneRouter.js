const Router = require('express');
const router = new Router();
const phoneController = require('../controllers/phoneController');

router.post('/',phoneController.create)
router.get('/',phoneController.getAll)
router.get('/:id',phoneController.getOne)
router.get('/maximum_price', phoneController.getMaximumPirce)
module.exports = router;