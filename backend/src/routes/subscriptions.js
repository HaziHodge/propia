const express = require('express');
const router = express.Router();
const subscriptionsController = require('../controllers/subscriptions');
const authMiddleware = require('../middleware/auth');

router.get('/plans', subscriptionsController.getPlans);
router.post('/subscribe', authMiddleware, subscriptionsController.subscribe);

module.exports = router;
