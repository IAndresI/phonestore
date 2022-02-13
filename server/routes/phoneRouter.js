const Router = require('express');
const router = new Router();
const phoneController = require('../controllers/phoneController');

router.get('/get_several',phoneController.getSeveral);
router.get('/reviews/:id',phoneController.getReviews);
router.get('/reviews',phoneController.getAllReviews);
router.post('/reviews/:id',phoneController.createReview);
router.put('/reviews/:id',phoneController.editReview);
router.get('/newest',phoneController.getNewest);
router.get('/filter', phoneController.getAllFilter);
router.get('/search', phoneController.search);
router.post('/',phoneController.create);
router.get('/',phoneController.getAll);
router.get('/:id',phoneController.getOne);
router.delete('/reviews/:id',phoneController.removeReview);

module.exports = router;