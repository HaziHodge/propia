import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { AlertCircle } from 'lucide-react';
import ContractCard from '../../components/dashboard/ContractCard';
import ContractForm from '../../components/dashboard/ContractForm';
import Modal from '../../components/shared/Modal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Toast from '../../components/shared/Toast';
import { Plus, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ContractsPage = () => {
  const isDemoMode = useAuthStore(state => state.isDemoMode);
  const [contracts, setContracts] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');

  const location = useLocation();

  const fetchData = async () => {
    if (isDemoMode) {
      setContracts([
        { id: '1', property_address: 'Av. Providencia 1234 Depto 52', tenant_name: 'María González', tenant_email: 'maria@example.com', rent_amount: 550000, payment_day: 5, start_date: '2025-01-01', end_date: '2025-12-31', status: 'active' }
      ]);
      setProperties([
        { id: '1', address: 'Av. Providencia 1234 Depto 52', active_contract_status: 'active' },
        { id: '2', address: 'Los Leones 456 Casa 3' }
      ]);
      setLoading(false);
      return;
    }
    try {
      const [contractsRes, propsRes] = await Promise.all([
        api.get('/contracts'),
        api.get('/properties')
      ]);
      setContracts(contractsRes.data);
      setProperties(propsRes.data);
    } catch (err) {
      setError('Error al cargar datos de contratos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (location.state?.createFor) {
      setIsModalOpen(true);
    }
  }, [location.state]);

  const handleCreateContract = async (data) => {
    if (isDemoMode) {
      const newContract = {
        id: Date.now().toString(),
        property_id: data.property_id,
        property_address: properties.find(p => p.id === data.property_id)?.address || 'Propiedad demo',
        tenant_name: data.tenant_name,
        tenant_rut: data.tenant_rut,
        tenant_email: data.tenant_email,
        rent_amount: parseInt(data.rent_amount),
        payment_day: parseInt(data.payment_day),
        start_date: data.start_date,
        end_date: data.end_date,
        status: 'pending_signature',
        deposit_amount: parseInt(data.deposit_amount)
      };
      setContracts(prev => [newContract, ...prev]);
      setSuccess('Contrato creado en modo demo ✓');
      setIsModalOpen(false);
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/contracts', data);
      setSuccess(`Contrato creado. Se envió invitación a ${data.tenant_email}`);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear contrato');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = (id) => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/contracts/${id}/pdf`, '_blank');
  };

  const handleResendInvite = async (id) => {
    if (isDemoMode) {
      setSuccess('Invitación reenviada (Simulado)');
      return;
    }
    try {
      await api.post(`/contracts/${id}/resend-invite`);
      setSuccess('Invitación reenviada exitosamente');
    } catch (err) {
      setError('Error al reenviar invitación');
    }
  };

  const handleTerminate = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas terminar este contrato?')) return;
    if (isDemoMode) {
      setContracts(prev => prev.map(c => c.id === id ? { ...c, status: 'terminated' } : c));
      setSuccess('Contrato terminado (Simulado)');
      return;
    }
    try {
      await api.patch(`/contracts/${id}/status`, { status: 'terminated' });
      setSuccess('Contrato terminado');
      fetchData();
    } catch (err) {
      setError('Error al terminar contrato');
    }
  };

  const filteredContracts = contracts.filter(c => filter === 'all' || c.status === filter);

  if (loading) return <LoadingSpinner size={48} className="h-96" />;

  return (
    <div className="space-y-8 animate-fade-in">
      {isDemoMode && (
        <div className="bg-gold/10 border-2 border-gold/20 p-4 rounded-xl flex items-center gap-3 text-gold">
          <AlertCircle size={20} />
          <p className="text-sm font-bold uppercase tracking-tight">🎭 Modo Demo — Los datos son de ejemplo. Todas las acciones funcionan localmente. Crea tu cuenta para usar con tus propiedades reales.</p>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {['all', 'active', 'pending_signature', 'terminated'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-tight ${
                filter === f ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : f === 'pending_signature' ? 'Por Firmar' : 'Terminados'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/30 w-full md:w-auto justify-center"
        >
          <Plus size={20} /> Nuevo contrato
        </button>
      </div>

      {filteredContracts.length === 0 ? (
        <div className="bg-white p-20 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No se encontraron contratos</h3>
          <p className="text-slate-500 max-w-sm">Crea un nuevo contrato para empezar a cobrar tus arriendos automáticamente.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredContracts.map((c) => (
            <ContractCard
              key={c.id}
              contract={c}
              onDownload={handleDownload}
              onResendInvite={handleResendInvite}
              onTerminate={handleTerminate}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generar Nuevo Contrato Digital"
      >
        <ContractForm
          properties={properties}
          onSubmit={handleCreateContract}
          onCancel={() => setIsModalOpen(false)}
          loading={submitting}
          initialPropertyId={location.state?.createFor}
        />
      </Modal>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
    </div>
  );
};

export default ContractsPage;
