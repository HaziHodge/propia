const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', paymentsController.getPayments);
router.post('/:id/generate-link', paymentsController.generateLink);
router.post('/:id/mark-paid', paymentsController.markPaid);

module.exports = router;
