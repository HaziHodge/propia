const db = require('../config/db');
const { createSubscription } = require('../services/flow');

exports.getPlans = (req, res) => {
  const plans = [
    { id: 'basic', name: 'Básico', price: 19900, max_properties: 1, features: ['1 propiedad', 'Contrato digital', 'Cobro con Khipu'] },
    { id: 'pro', name: 'Pro', price: 34900, max_properties: 3, features: ['Hasta 3 propiedades', 'Todo lo anterior', 'Historial completo'] },
    { id: 'investor', name: 'Inversor', price: 59900, max_properties: 10, features: ['Hasta 10 propiedades', 'Todo lo anterior', 'Reportes exportables'] }
  ];
  res.json(plans);
};

exports.subscribe = async (req, res, next) => {
  const { plan } = req.body;
  try {
    const ownerResult = await db.query('SELECT * FROM owners WHERE id = $1', [req.ownerId]);
    const owner = ownerResult.rows[0];

    const plans = [
      { id: 'basic', price: 19900 },
      { id: 'pro', price: 34900 },
      { id: 'investor', price: 59900 }
    ];
    const planDetails = plans.find(p => p.id === plan);

    const subscription = await createSubscription(owner, planDetails);

    await db.query(
      'INSERT INTO subscriptions (owner_id, plan, price, status, flow_subscription_id) VALUES ($1, $2, $3, \'pending\', $4)',
      [owner.id, plan, planDetails.price, subscription.token]
    );

    res.json({ paymentUrl: subscription.url });
  } catch (err) {
    next(err);
  }
};
