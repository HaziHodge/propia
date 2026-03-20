const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/properties');
const authMiddleware = require('../middleware/auth');
const { body } = require('express-validator');

router.use(authMiddleware);

router.get('/', propertiesController.getProperties);
router.post('/', [
  body('address').notEmpty(),
  body('commune').notEmpty(),
  body('property_type').notEmpty()
], propertiesController.createProperty);
router.put('/:id', propertiesController.updateProperty);
router.delete('/:id', propertiesController.deleteProperty);

module.exports = router;
