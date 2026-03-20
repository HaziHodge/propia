const axios = require('axios');
require('dotenv').config();

const KHIPU_BASE_URL = 'https://payment-api.khipu.com/v3';

const createPayment = async (payment, contract, propertyAddress) => {
  if (process.env.NODE_ENV === 'development' && !process.env.KHIPU_API_KEY) {
    return {
      payment_id: 'dummy_id_' + Date.now(),
      payment_url: 'https://khipu.com/dummy-payment-link',
      simplified_transfer_url: 'https://khipu.com/dummy-transfer-link'
    };
  }

  const dueDate = new Date(payment.due_date);
  dueDate.setDate(dueDate.getDate() + 3);

  try {
    const response = await axios.post(`${KHIPU_BASE_URL}/payments`, {
      amount: payment.amount,
      currency: 'CLP',
      subject: `Arriendo ${propertyAddress} - ${payment.period_month}/${payment.period_year}`,
      body: `Pago de arriendo correspondiente al período ${payment.period_month}/${payment.period_year}`,
      notify_url: `${process.env.API_URL}/api/webhooks/khipu`,
      return_url: `${process.env.FRONTEND_URL}/tenant/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/tenant/payment-cancelled`,
      expires_date: dueDate.toISOString(),
      payer_email: contract.tenant_email,
      payer_name: contract.tenant_name
    }, {
      headers: { 'Authorization': `Bearer ${process.env.KHIPU_API_KEY}` }
    });

    return response.data;
  } catch (err) {
    console.error('Khipu error:', err.response?.data || err.message);
    throw new Error('Khipu payment creation failed');
  }
};

const verifyNotification = async (notification_token) => {
  if (process.env.NODE_ENV === 'development' && !process.env.KHIPU_API_KEY) {
    return { payment_id: 'dummy_id', status: 'done' };
  }

  try {
    const response = await axios.post(`${KHIPU_BASE_URL}/notifications/verify`, {
      notification_token
    }, {
      headers: { 'Authorization': `Bearer ${process.env.KHIPU_API_KEY}` }
    });

    return response.data;
  } catch (err) {
    console.error('Khipu verification error:', err.response?.data || err.message);
    throw new Error('Khipu notification verification failed');
  }
};

module.exports = { createPayment, verifyNotification };
