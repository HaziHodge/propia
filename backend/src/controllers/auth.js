const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, rut, email, password, phone } = req.body;
  try {
    const existing = await db.query('SELECT id FROM owners WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await db.query(
      'INSERT INTO owners (name, rut, email, password_hash, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, rut, email, phone, plan',
      [name, rut, email, passwordHash, phone]
    );

    const owner = result.rows[0];
    const token = jwt.sign({ id: owner.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, owner });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM owners WHERE email = $1', [email]);
    const owner = result.rows[0];

    if (!owner || !(await bcrypt.compare(password, owner.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: owner.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    delete owner.password_hash;

    res.json({ token, owner });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name, rut, email, phone, plan FROM owners WHERE id = $1', [req.ownerId]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
