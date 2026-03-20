import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import Toast from '../../components/shared/Toast';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { CreditCard, Check, Shield } from 'lucide-react';

const SettingsPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const owner = useAuthStore(state => state.owner);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/subscriptions/plans');
        setPlans(res.data);
      } catch (err) {
        setError('Error al cargar planes de suscripción');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    setSubmitting(true);
    try {
      const res = await api.post('/subscriptions/subscribe', { plan: planId });
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      setError('Error al iniciar suscripción');
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size={48} className="h-96" />;

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 italic">
          <Shield size={24} className="text-primary" /> Tu Plan Actual
        </h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium mb-1 uppercase text-xs tracking-widest">Plan</p>
            <h4 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">{owner?.plan}</h4>
          </div>
          <div className="bg-primary/10 text-primary px-6 py-2 rounded-full font-bold uppercase text-xs">Activo</div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2 italic">
          <CreditCard size={24} className="text-primary" /> Cambiar de Plan
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white p-8 rounded-2xl border transition-all ${
                owner?.plan === plan.id ? 'border-primary ring-4 ring-primary/5 shadow-xl' : 'border-slate-200 hover:border-primary/40'
              }`}
            >
              <h4 className="text-xl font-bold mb-1 text-slate-800 uppercase tracking-tighter">{plan.name}</h4>
              <p className="text-3xl font-black mb-6 text-slate-900">${plan.price.toLocaleString('es-CL')}<span className="text-xs font-normal text-slate-400">/mes</span></p>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={16} className="text-primary flex-shrink-0" /> {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={owner?.plan === plan.id || submitting}
                className={`w-full font-bold py-3.5 rounded-xl transition-all ${
                  owner?.plan === plan.id
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20'
                }`}
              >
                {owner?.plan === plan.id ? 'Plan Actual' : 'Seleccionar'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
    </div>
  );
};

export default SettingsPage;
