import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import PaymentRow from '../../components/dashboard/PaymentRow';
import StatsCard from '../../components/dashboard/StatsCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Toast from '../../components/shared/Toast';
import { DollarSign, Clock, AlertCircle } from 'lucide-react';
import { formatCLP } from '../../utils/formatCLP';

const PaymentsPage = () => {
  const isDemoMode = useAuthStore(state => state.isDemoMode);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({ collected: 0, pending: 0, overdue: 0 });
  const [filter, setFilter] = useState('all');

  const fetchPayments = async () => {
    if (isDemoMode) {
      const data = [
        { id: '1', property_address: 'Av. Providencia 1234 Depto 52', amount: 550000, period_month: 1, period_year: 2025, due_date: '2025-01-05', status: 'paid' },
        { id: '2', property_address: 'Av. Providencia 1234 Depto 52', amount: 550000, period_month: 2, period_year: 2025, due_date: '2025-02-05', status: 'paid' },
        { id: '3', property_address: 'Av. Providencia 1234 Depto 52', amount: 550000, period_month: 6, period_year: 2025, due_date: '2025-06-05', status: 'pending' }
      ];
      setPayments(data);
      setStats({ collected: 1100000, pending: 550000, overdue: 0 });
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/payments');
      const data = res.data;
      setPayments(data);

      const collected = data.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
      const pending = data.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
      const overdue = data.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

      setStats({ collected, pending, overdue });
    } catch (err) {
      setError('Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [isDemoMode]);

  const handleGenerateLink = async (id) => {
    try {
      const res = await api.post(`/payments/${id}/generate-link`);
      window.open(res.data.paymentUrl, '_blank');
      setSuccess('Link de pago generado exitosamente');
    } catch (err) {
      setError('Error al generar link de pago');
    }
  };

  const handleMarkPaid = async (id) => {
    if (!window.confirm('¿Deseas marcar este pago como pagado manualmente?')) return;
    try {
      await api.post(`/payments/${id}/mark-paid`, { payment_method: 'manual' });
      setSuccess('Pago marcado como pagado');
      fetchPayments();
    } catch (err) {
      setError('Error al marcar pago como pagado');
    }
  };

  const filteredPayments = payments.filter(p => filter === 'all' || p.status === filter);

  if (loading) return <LoadingSpinner size={48} className="h-96" />;

  return (
    <div className="space-y-8 animate-fade-in">
      {isDemoMode && (
        <div className="bg-gold/10 border-2 border-gold/20 p-4 rounded-xl flex items-center gap-3 text-gold">
          <AlertCircle size={20} />
          <p className="text-sm font-bold uppercase tracking-tight">Modo Demo: Solo lectura.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total recaudado" value={formatCLP(stats.collected)} icon={<DollarSign size={24} />} color="success" />
        <StatsCard title="Total pendiente" value={formatCLP(stats.pending)} icon={<Clock size={24} />} color="warning" />
        <StatsCard title="Total atrasado" value={formatCLP(stats.overdue)} icon={<AlertCircle size={24} />} color="danger" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
          <h3 className="font-bold text-slate-800 text-lg">Historial de Pagos</h3>
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            {['all', 'paid', 'pending', 'overdue'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-tight ${
                  filter === f ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'paid' ? 'Pagados' : f === 'pending' ? 'Pendientes' : 'Atrasados'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Propiedad / Periodo</th>
                <th className="px-6 py-4">Monto</th>
                <th className="px-6 py-4">Vencimiento</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">No se encontraron pagos para este filtro</td></tr>
              ) : (
                filteredPayments.map((p) => (
                  <PaymentRow
                    key={p.id}
                    payment={p}
                    onGenerateLink={handleGenerateLink}
                    onMarkPaid={handleMarkPaid}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
    </div>
  );
};

export default PaymentsPage;
