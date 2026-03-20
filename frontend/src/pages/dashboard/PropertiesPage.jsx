import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { AlertCircle } from 'lucide-react';
import PropertyCard from '../../components/dashboard/PropertyCard';
import PropertyForm from '../../components/dashboard/PropertyForm';
import Modal from '../../components/shared/Modal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Toast from '../../components/shared/Toast';
import { Plus, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PropertiesPage = () => {
  const isDemoMode = useAuthStore(state => state.isDemoMode);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    if (isDemoMode) {
      setProperties([
        { id: '1', address: 'Av. Providencia 1234 Depto 52', commune: 'Providencia', region: 'RM', property_type: 'departamento', bedrooms: 2, bathrooms: 1, area_m2: 65, active_contract_status: 'active' },
        { id: '2', address: 'Los Leones 456 Casa 3', commune: 'Las Condes', region: 'RM', property_type: 'casa', bedrooms: 3, bathrooms: 2, area_m2: 120 }
      ]);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/properties');
      setProperties(res.data);
    } catch (err) {
      setError('Error al cargar propiedades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [isDemoMode]);

  const handleCreateProperty = async (data) => {
    if (isDemoMode) {
      const newProperty = {
        id: Date.now().toString(),
        ...data,
        active_contract_status: null,
        contract_count: 0
      };
      setProperties(prev => [newProperty, ...prev]);
      setIsModalOpen(false);
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/properties', data);
      setIsModalOpen(false);
      fetchProperties();
    } catch (err) {
      setError('Error al crear propiedad');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateContract = (propId) => {
    navigate('/dashboard/contracts', { state: { createFor: propId } });
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
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-500 font-medium">Administra tus bienes inmuebles</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/30"
        >
          <Plus size={20} /> Agregar propiedad
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white p-20 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center">
            <Building size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No tienes propiedades registradas</h3>
          <p className="text-slate-500 max-w-sm">Comienza agregando tu primera propiedad para empezar a gestionar tus arriendos.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-primary font-bold hover:underline"
          >
            Agregar propiedad ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} onCreateContract={handleCreateContract} />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Propiedad"
      >
        <PropertyForm onSubmit={handleCreateProperty} onCancel={() => setIsModalOpen(false)} loading={submitting} />
      </Modal>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
    </div>
  );
};

export default PropertiesPage;
