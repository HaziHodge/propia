const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant');

router.get('/contract/:token', tenantController.getContractByToken);
router.get('/contract/pdf/:id', tenantController.downloadPdf);
router.post('/contract/:token/sign', tenantController.signContract);
router.get('/payments/:contractId', tenantController.getPaymentHistory);

module.exports = router;
