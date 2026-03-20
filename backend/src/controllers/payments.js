const db = require('../config/db');
const { createPayment } = require('../services/khipu');

exports.getPayments = async (req, res, next) => {
  const { contract_id, status, year, month } = req.query;
  try {
    let query = 'SELECT p.*, pr.address as property_address FROM payments p JOIN contracts c ON p.contract_id = c.id JOIN properties pr ON c.property_id = pr.id WHERE p.owner_id = $1';
    const params = [req.ownerId];

    if (contract_id) {
      params.push(contract_id);
      query += ` AND p.contract_id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND p.status = $${params.length}`;
    }
    if (year) {
      params.push(year);
      query += ` AND p.period_year = $${params.length}`;
    }
    if (month) {
      params.push(month);
      query += ` AND p.period_month = $${params.length}`;
    }

    query += ' ORDER BY p.due_date ASC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.generateLink = async (req, res, next) => {
  try {
    const paymentResult = await db.query('SELECT p.*, pr.address as property_address FROM payments p JOIN contracts c ON p.contract_id = c.id JOIN properties pr ON c.property_id = pr.id WHERE p.id = $1 AND p.owner_id = $2', [req.params.id, req.ownerId]);
    if (paymentResult.rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
    const payment = paymentResult.rows[0];

    const contractResult = await db.query('SELECT tenant_name, tenant_email FROM contracts WHERE id = $1', [payment.contract_id]);
    const contract = contractResult.rows[0];

    const khipuPayment = await createPayment(payment, contract, payment.property_address);

    await db.query(
      'UPDATE payments SET khipu_payment_id = $1, khipu_payment_url = $2 WHERE id = $3',
      [khipuPayment.payment_id, khipuPayment.payment_url, payment.id]
    );

    res.json({ paymentUrl: khipuPayment.payment_url });
  } catch (err) {
    next(err);
  }
};

exports.markPaid = async (req, res, next) => {
  const { payment_method, paid_date } = req.body;
  try {
    const result = await db.query(
      'UPDATE payments SET status = \'paid\', payment_method = $1, paid_date = $2 WHERE id = $3 AND owner_id = $4 RETURNING *',
      [payment_method || 'manual', paid_date || new Date(), req.params.id, req.ownerId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
