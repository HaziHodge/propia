const db = require('../config/db');
const { validationResult } = require('express-validator');
const { generateContractPDF } = require('../services/pdf');
const { sendTenantInvite } = require('../services/email');
const { v4: uuidv4 } = require('uuid');
const { addMonths } = require('date-fns');

exports.getContracts = async (req, res, next) => {
  try {
    const query = `
      SELECT c.*, p.address as property_address,
      (SELECT SUM(amount) FROM payments WHERE contract_id = c.id AND status = 'paid') as total_paid,
      (SELECT COUNT(*) FROM payments WHERE contract_id = c.id AND status = 'pending') as pending_payments
      FROM contracts c
      JOIN properties p ON c.property_id = p.id
      WHERE c.owner_id = $1
    `;
    const result = await db.query(query, [req.ownerId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getContract = async (req, res, next) => {
  try {
    const contractResult = await db.query('SELECT * FROM contracts WHERE id = $1 AND owner_id = $2', [req.params.id, req.ownerId]);
    if (contractResult.rows.length === 0) return res.status(404).json({ error: 'Contract not found' });

    const paymentsResult = await db.query('SELECT * FROM payments WHERE contract_id = $1 ORDER BY due_date ASC', [req.params.id]);

    res.json({
      ...contractResult.rows[0],
      payments: paymentsResult.rows
    });
  } catch (err) {
    next(err);
  }
};

exports.createContract = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    property_id, tenant_name, tenant_rut, tenant_email, tenant_phone,
    rent_amount, rent_currency, payment_day, start_date, end_date,
    deposit_months, deposit_amount, notes
  } = req.body;

  try {
    const propCheck = await db.query('SELECT address FROM properties WHERE id = $1 AND owner_id = $2', [property_id, req.ownerId]);
    if (propCheck.rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    const property = propCheck.rows[0];

    const contractCheck = await db.query('SELECT id FROM contracts WHERE property_id = $1 AND status = \'active\'', [property_id]);
    if (contractCheck.rows.length > 0) return res.status(400).json({ error: 'Property already has an active contract' });

    const inviteToken = uuidv4();
    const inviteExpires = new Date();
    inviteExpires.setDate(inviteExpires.getDate() + 7);

    const ownerResult = await db.query('SELECT name, rut FROM owners WHERE id = $1', [req.ownerId]);
    const owner = ownerResult.rows[0];

    const contractResult = await db.query(
      `INSERT INTO contracts (
        property_id, owner_id, tenant_name, tenant_rut, tenant_email, tenant_phone,
        rent_amount, rent_currency, payment_day, start_date, end_date,
        deposit_months, deposit_amount, notes, tenant_invite_token, tenant_invite_expires,
        owner_signed_at, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), 'pending_signature') RETURNING *`,
      [property_id, req.ownerId, tenant_name, tenant_rut, tenant_email, tenant_phone,
       rent_amount, rent_currency, payment_day, start_date, end_date,
       deposit_months, deposit_amount, notes, inviteToken, inviteExpires]
    );

    const contract = contractResult.rows[0];

    const pdfPath = await generateContractPDF(contract, property, owner);
    await db.query('UPDATE contracts SET contract_pdf_url = $1 WHERE id = $2', [pdfPath, contract.id]);

    const inviteUrl = `${process.env.FRONTEND_URL}/tenant/contract/${inviteToken}`;
    await sendTenantInvite(contract, inviteUrl, property.address, owner.name);

    const start = new Date(start_date);
    const end = new Date(end_date);
    let current = start;

    while (current <= end) {
      const due_date = new Date(current.getFullYear(), current.getMonth(), payment_day);
      await db.query(
        'INSERT INTO payments (contract_id, owner_id, amount, period_month, period_year, due_date, status) VALUES ($1, $2, $3, $4, $5, $6, \'pending\')',
        [contract.id, req.ownerId, rent_amount, current.getMonth() + 1, current.getFullYear(), due_date]
      );
      current = addMonths(current, 1);
    }

    res.status(201).json({ ...contract, inviteUrl });
  } catch (err) {
    next(err);
  }
};

exports.resendInvite = async (req, res, next) => {
  try {
    const inviteToken = uuidv4();
    const inviteExpires = new Date();
    inviteExpires.setDate(inviteExpires.getDate() + 7);

    const result = await db.query(
      'UPDATE contracts SET tenant_invite_token = $1, tenant_invite_expires = $2 WHERE id = $3 AND owner_id = $4 RETURNING *',
      [inviteToken, inviteExpires, req.params.id, req.ownerId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Contract not found' });
    const contract = result.rows[0];

    const propResult = await db.query('SELECT address FROM properties WHERE id = $1', [contract.property_id]);
    const ownerResult = await db.query('SELECT name FROM owners WHERE id = $1', [req.ownerId]);

    const inviteUrl = `${process.env.FRONTEND_URL}/tenant/contract/${inviteToken}`;
    await sendTenantInvite(contract, inviteUrl, propResult.rows[0].address, ownerResult.rows[0].name);

    res.json({ message: 'Invitation resent', inviteUrl });
  } catch (err) {
    next(err);
  }
};

exports.downloadPdf = async (req, res, next) => {
  try {
    const result = await db.query('SELECT contract_pdf_url FROM contracts WHERE id = $1 AND owner_id = $2', [req.params.id, req.ownerId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Contract not found' });

    const pdfPath = result.rows[0].contract_pdf_url;
    if (!require('fs').existsSync(pdfPath)) return res.status(404).json({ error: 'PDF not found' });

    res.download(pdfPath);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE contracts SET status = $1, updated_at = NOW() WHERE id = $2 AND owner_id = $3 RETURNING *',
      [status, req.params.id, req.ownerId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Contract not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
