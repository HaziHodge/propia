const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.getProperties = async (req, res, next) => {
  try {
    const query = `
      SELECT p.*,
      (SELECT COUNT(*) FROM contracts WHERE property_id = p.id) as contract_count,
      (SELECT status FROM contracts WHERE property_id = p.id AND status = 'active' LIMIT 1) as active_contract_status
      FROM properties p
      WHERE p.owner_id = $1 AND p.active = true
    `;
    const result = await db.query(query, [req.ownerId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.createProperty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { address, commune, region, property_type, bedrooms, bathrooms, area_m2 } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO properties (owner_id, address, commune, region, property_type, bedrooms, bathrooms, area_m2) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.ownerId, address, commune, region, property_type, bedrooms, bathrooms, area_m2]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateProperty = async (req, res, next) => {
  const { address, commune, region, property_type, bedrooms, bathrooms, area_m2 } = req.body;
  try {
    const result = await db.query(
      'UPDATE properties SET address = $1, commune = $2, region = $3, property_type = $4, bedrooms = $5, bathrooms = $6, area_m2 = $7 WHERE id = $8 AND owner_id = $9 RETURNING *',
      [address, commune, region, property_type, bedrooms, bathrooms, area_m2, req.params.id, req.ownerId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const activeContract = await db.query('SELECT id FROM contracts WHERE property_id = $1 AND status = \'active\'', [req.params.id]);
    if (activeContract.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete property with active contract' });
    }

    const result = await db.query('UPDATE properties SET active = false WHERE id = $1 AND owner_id = $2 RETURNING *', [req.params.id, req.ownerId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    next(err);
  }
};
