const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const FLOW_API_URL = process.env.FLOW_API_URL || 'https://sandbox.flow.cl/api';

const sign = (params) => {
  const sortedKeys = Object.keys(params).sort();
  let str = '';
  for (const key of sortedKeys) {
    str += key + params[key];
  }
  return crypto.createHmac('sha256', process.env.FLOW_SECRET_KEY).update(str).digest('hex');
};

const createSubscription = async (owner, planDetails) => {
  const params = {
    apiKey: process.env.FLOW_API_KEY,
    amount: planDetails.price,
    currency: 'CLP',
    customer_email: owner.email,
    planId: planDetails.id,
    return_url: `${process.env.FRONTEND_URL}/dashboard/settings?status=success`,
    cancel_url: `${process.env.FRONTEND_URL}/dashboard/settings?status=cancel`
  };
  params.s = sign(params);

  try {
    const response = await axios.post(`${FLOW_API_URL}/subscription/create`, new URLSearchParams(params).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  } catch (err) {
    console.error('Flow error:', err.response?.data || err.message);
    throw new Error('Flow subscription creation failed');
  }
};

module.exports = { createSubscription };
