const db = require('../config/db');
const { generateContractPDF } = require('../services/pdf');

exports.getContractByToken = async (req, res, next) => {
  const { token } = req.params;
  try {
    const query = `
      SELECT c.*, p.address, p.commune, p.region, p.property_type, p.bedrooms, p.bathrooms, p.area_m2, o.name as owner_name
      FROM contracts c
      JOIN properties p ON c.property_id = p.id
      JOIN owners o ON c.owner_id = o.id
      WHERE c.tenant_invite_token = $1
    `;
    const result = await db.query(query, [token]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invalid or expired token' });

    const contract = result.rows[0];
    if (new Date() > new Date(contract.tenant_invite_expires)) {
      return res.status(401).json({ error: 'Token expired' });
    }

    res.json({
      contract,
      property: { address: contract.address, commune: contract.commune, region: contract.region, type: contract.property_type },
      alreadySigned: !!contract.tenant_signed_at
    });
  } catch (err) {
    next(err);
  }
};

exports.signContract = async (req, res, next) => {
  const { token } = req.params;
  const { tenant_name, tenant_rut, signature_confirmed } = req.body;

  if (!signature_confirmed) return res.status(400).json({ error: 'Signature confirmation required' });

  try {
    const result = await db.query('SELECT * FROM contracts WHERE tenant_invite_token = $1', [token]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Contract not found' });

    const contract = result.rows[0];
    if (contract.tenant_rut !== tenant_rut) return res.status(400).json({ error: 'RUT mismatch' });

    await db.query(
      'UPDATE contracts SET tenant_signed_at = NOW(), status = \'active\' WHERE id = $1',
      [contract.id]
    );

    const propResult = await db.query('SELECT * FROM properties WHERE id = $1', [contract.property_id]);
    const ownerResult = await db.query('SELECT * FROM owners WHERE id = $1', [contract.owner_id]);

    const updatedContract = { ...contract, tenant_signed_at: new Date() };
    const pdfPath = await generateContractPDF(updatedContract, propResult.rows[0], ownerResult.rows[0]);
    await db.query('UPDATE contracts SET contract_pdf_url = $1 WHERE id = $2', [pdfPath, contract.id]);

    res.json({ success: true, contractId: contract.id });
  } catch (err) {
    next(err);
  }
};

exports.downloadPdf = async (req, res, next) => {
  try {
    const result = await db.query('SELECT contract_pdf_url FROM contracts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Contract not found' });

    const pdfPath = result.rows[0].contract_pdf_url;
    if (!require('fs').existsSync(pdfPath)) return res.status(404).json({ error: 'PDF not found' });

    res.download(pdfPath);
  } catch (err) {
    next(err);
  }
};

exports.getPaymentHistory = async (req, res, next) => {
  const { contractId } = req.params;
  try {
    const result = await db.query(
      'SELECT amount, period_month, period_year, status, paid_date, due_date FROM payments WHERE contract_id = $1 ORDER BY due_date ASC',
      [contractId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
