const express = require('express');
const router = express.Router();
const contractsController = require('../controllers/contracts');
const authMiddleware = require('../middleware/auth');
const { body } = require('express-validator');

router.use(authMiddleware);

router.get('/', contractsController.getContracts);
router.get('/:id', contractsController.getContract);
router.get('/:id/pdf', contractsController.downloadPdf);
router.post('/', [
  body('property_id').isUUID(),
  body('tenant_name').notEmpty(),
  body('tenant_rut').notEmpty(),
  body('tenant_email').isEmail(),
  body('rent_amount').isInt({ min: 1 })
], contractsController.createContract);
router.post('/:id/resend-invite', contractsController.resendInvite);
router.patch('/:id/status', contractsController.updateStatus);

module.exports = router;
