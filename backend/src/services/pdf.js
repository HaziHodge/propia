const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generateContractPDF = async (contract, property, owner) => {
  const templatePath = path.join(__dirname, '../../templates/contract-template.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PROPERTY_ADDRESS}}': property.address,
    '{{OWNER_NAME}}': owner.name,
    '{{OWNER_RUT}}': owner.rut,
    '{{TENANT_NAME}}': contract.tenant_name,
    '{{TENANT_RUT}}': contract.tenant_rut,
    '{{RENT_AMOUNT_FORMATTED}}': new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(contract.rent_amount),
    '{{RENT_CURRENCY}}': contract.rent_currency || 'CLP',
    '{{PAYMENT_DAY}}': contract.payment_day,
    '{{START_DATE}}': contract.start_date,
    '{{END_DATE}}': contract.end_date,
    '{{DEPOSIT_AMOUNT}}': new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(contract.deposit_amount),
    '{{CONTRACT_DATE}}': new Date().toLocaleDateString('es-CL'),
    '{{OWNER_SIGNED}}': contract.owner_signed_at ? new Date(contract.owner_signed_at).toLocaleDateString('es-CL') : 'Pendiente',
    '{{TENANT_SIGNED}}': contract.tenant_signed_at ? new Date(contract.tenant_signed_at).toLocaleDateString('es-CL') : 'Pendiente de firma'
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html);

  const pdfPath = `/tmp/contract-${contract.id}.pdf`;
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
  });

  await browser.close();
  return pdfPath;
};

module.exports = { generateContractPDF };
