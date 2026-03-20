const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');
const { body } = require('express-validator');

router.post('/register', [
  body('email').isEmail(),
  body('rut').notEmpty(),
  body('name').notEmpty(),
  body('password').isLength({ min: 6 })
], authController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
