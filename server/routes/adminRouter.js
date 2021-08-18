const Router = require('express');
const router = new Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/dashboard/counts', authMiddleware, adminController.getDashboardCounts)

module.exports = router;