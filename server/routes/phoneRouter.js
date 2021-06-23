const Router = require('express');
const router = new Router();
const phoneController = require('../controllers/phoneController');

router.get('/min_max_price', phoneController.getMinMaxPirce);
router.post('/',phoneController.create);
router.get('/',phoneController.getAll);
router.get('/:id',phoneController.getOne);

module.exports = router;