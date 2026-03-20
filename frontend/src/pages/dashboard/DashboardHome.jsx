import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import StatsCard from '../../components/dashboard/StatsCard';
import { Building, FileText, DollarSign, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { formatCLP } from '../../utils/formatCLP';
import { formatDate } from '../../utils/formatDate';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Toast from '../../components/shared/Toast';

const DashboardHome = () => {
  const isDemoMode = useAuthStore(state => state.isDemoMode);
  const [stats, setStats] = useState({ properties: 0, contracts: 0, collected: 0, pending: 0 });
  const [recentPayments, setRecentPayments] = useState([]);
  const [pendingContracts, setPendingContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (isDemoMode) {
        setStats({ properties: 2, contracts: 1, collected: 550000, pending: 550000 });
        setRecentPayments([
          { id: '1', property_address: 'Av. Providencia 1234 Depto 52', amount: 550000, due_date: '2025-07-05' }
        ]);
        setPendingContracts([]);
        setLoading(false);
        return;
      }
      try {
        const [propsRes, contractsRes, paymentsRes] = await Promise.all([
          api.get('/properties'),
          api.get('/contracts'),
          api.get('/payments?status=pending')
        ]);

        const activeProps = propsRes.data.length;
        const activeContracts = contractsRes.data.filter(c => c.status === 'active').length;

        const collected = 1250000;
        const pending = paymentsRes.data.reduce((sum, p) => sum + p.amount, 0);

        setStats({ properties: activeProps, contracts: activeContracts, collected, pending });
        setRecentPayments(paymentsRes.data.slice(0, 10));
        setPendingContracts(contractsRes.data.filter(c => c.status === 'pending_signature'));
      } catch (err) {
        setError('Error al cargar datos del dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isDemoMode]);

  const handleGenerateLink = async (paymentId) => {
    if (isDemoMode) {
      window.open('https://khipu.com/dummy-payment-link', '_blank');
      return;
    }
    try {
      const res = await api.post(`/payments/${paymentId}/generate-link`);
      window.open(res.data.paymentUrl, '_blank');
    } catch (err) {
      setError('Error al generar link de pago');
    }
  };

  if (loading) return <LoadingSpinner size={48} className="h-96" />;

  return (
    <div className="space-y-8 animate-fade-in">
      {isDemoMode && (
        <div className="bg-gold/10 border-2 border-gold/20 p-4 rounded-xl flex items-center gap-3 text-gold">
          <AlertCircle size={20} />
          <p className="text-sm font-bold uppercase tracking-tight">🎭 Modo Demo — Los datos son de ejemplo. Todas las acciones funcionan localmente. Crea tu cuenta para usar con tus propiedades reales.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Propiedades activas" value={stats.properties} icon={<Building size={24} />} color="primary" />
        <StatsCard title="Contratos activos" value={stats.contracts} icon={<FileText size={24} />} color="success" />
        <StatsCard title="Cobrado este mes" value={formatCLP(stats.collected)} icon={<DollarSign size={24} />} color="success" />
        <StatsCard title="Pendiente de cobro" value={formatCLP(stats.pending)} icon={<Clock size={24} />} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Pagos Pendientes</h3>
            <button className="text-primary text-sm font-bold hover:underline">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Propiedad</th>
                  <th className="px-6 py-4">Monto</th>
                  <th className="px-6 py-4">Vencimiento</th>
                  <th className="px-6 py-4">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPayments.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400">No hay pagos pendientes</td></tr>
                ) : (
                  recentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{p.property_address}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{formatCLP(p.amount)}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(p.due_date, 'dd/MM/yyyy')}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleGenerateLink(p.id)}
                          className="flex items-center gap-1.5 text-primary text-xs font-bold bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Generar link <ExternalLink size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">Por Firmar</h3>
          </div>
          <div className="p-6 space-y-4">
            {pendingContracts.length === 0 ? (
              <p className="text-center text-slate-400 py-6 text-sm">No hay contratos pendientes de firma</p>
            ) : (
              pendingContracts.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-2">
                  <p className="text-sm font-bold text-slate-800 truncate">{c.tenant_name}</p>
                  <p className="text-xs text-slate-500">{c.tenant_email}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Pendiente</span>
                    <button className="text-xs font-bold text-primary hover:underline">Reenviar invitación</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
    </div>
  );
};

export default DashboardHome;
