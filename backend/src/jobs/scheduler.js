const db = require('../config/db');
const { sendPaymentReminder } = require('../services/email');
const { createPayment } = require('../services/khipu');

const runScheduler = () => {
  setInterval(async () => {
    const today = new Date();
    if (today.getHours() === 9) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 3);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      const payments = await db.query(
        'SELECT p.*, c.tenant_name, c.tenant_email, pr.address FROM payments p JOIN contracts c ON p.contract_id = c.id JOIN properties pr ON c.property_id = pr.id WHERE p.status = \'pending\' AND p.due_date = $1',
        [targetDateStr]
      );

      for (const payment of payments.rows) {
        if (!payment.khipu_payment_url) {
          const khipuPayment = await createPayment(payment, payment, payment.address);
          payment.khipu_payment_url = khipuPayment.payment_url;
          await db.query('UPDATE payments SET khipu_payment_id = $1, khipu_payment_url = $2 WHERE id = $3', [khipuPayment.payment_id, khipuPayment.payment_url, payment.id]);
        }
        await sendPaymentReminder(payment, payment, payment.address);
      }
    }
  }, 1000 * 60 * 60);

  setInterval(async () => {
    const today = new Date();
    if (today.getHours() === 10) {
      const todayStr = today.toISOString().split('T')[0];
      await db.query(
        'UPDATE payments SET status = \'overdue\' WHERE status = \'pending\' AND due_date < $1',
        [todayStr]
      );
    }
  }, 1000 * 60 * 60);
};

module.exports = { runScheduler };
