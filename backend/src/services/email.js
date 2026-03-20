const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const createTransporter = async () => {
  if (process.env.NODE_ENV !== 'production') {
    let testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendTenantInvite = async (contract, inviteUrl, propertyAddress, ownerName) => {
  const transporter = await createTransporter();
  const templatePath = path.join(__dirname, '../../templates/email-invite.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{OWNER_NAME}}': ownerName,
    '{{PROPERTY_ADDRESS}}': propertyAddress,
    '{{RENT_AMOUNT_FORMATTED}}': new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(contract.rent_amount),
    '{{START_DATE}}': contract.start_date,
    '{{END_DATE}}': contract.end_date,
    '{{INVITE_URL}}': inviteUrl
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }

  await transporter.sendMail({
    from: `"PagoRenta" <${process.env.FROM_EMAIL}>`,
    to: contract.tenant_email,
    subject: "Tienes un contrato de arriendo pendiente de firma — PagoRenta",
    html: html
  });
};

const sendPaymentReminder = async (payment, contract, propertyAddress) => {
  const transporter = await createTransporter();
  const templatePath = path.join(__dirname, '../../templates/email-reminder.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const replacements = {
    '{{PROPERTY_ADDRESS}}': propertyAddress,
    '{{AMOUNT_DUE}}': new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(payment.amount),
    '{{DUE_DATE}}': new Date(payment.due_date).toLocaleDateString('es-CL'),
    '{{KHIPU_URL}}': payment.khipu_payment_url || '#'
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }

  await transporter.sendMail({
    from: `"PagoRenta" <${process.env.FROM_EMAIL}>`,
    to: contract.tenant_email,
    subject: `Recordatorio: Tu arriendo vence en 3 días`,
    html: html
  });
};

const sendPaymentConfirmation = async (payment, contract, ownerEmail, propertyAddress) => {
  const transporter = await createTransporter();

  await transporter.sendMail({
    from: `"PagoRenta" <${process.env.FROM_EMAIL}>`,
    to: ownerEmail,
    subject: `Pago recibido — ${propertyAddress}`,
    text: `Hola, te informamos que se ha recibido el pago del arriendo para la propiedad ${propertyAddress} por un monto de ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(payment.amount)} correspondiente al período ${payment.period_month}/${payment.period_year}.`
  });
};

module.exports = { sendTenantInvite, sendPaymentReminder, sendPaymentConfirmation };
