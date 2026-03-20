const db = require('../config/db');
const { verifyNotification } = require('../services/khipu');

exports.khipuWebhook = async (req, res, next) => {
  const { notification_token } = req.body;
  try {
    const verification = await verifyNotification(notification_token);
    if (verification.status === 'done') {
      await db.query(
        'UPDATE payments SET status = \'paid\', paid_date = NOW() WHERE khipu_payment_id = $1',
        [verification.payment_id]
      );
    }
    res.send('OK');
  } catch (err) {
    next(err);
  }
};

exports.flowWebhook = async (req, res, next) => {
  const { token } = req.body;
  try {
    // In a real scenario, we would call Flow API to get payment details using the token
    // For this MVP, we acknowledge the webhook.
    console.log(`Flow webhook received for token: ${token}`);
    res.send('OK');
  } catch (err) {
    next(err);
  }
};
