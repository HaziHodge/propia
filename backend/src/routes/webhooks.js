const express = require('express');
const router = express.Router();
const webhooksController = require('../controllers/webhooks');

router.post('/khipu', webhooksController.khipuWebhook);
router.post('/flow', webhooksController.flowWebhook);

module.exports = router;
