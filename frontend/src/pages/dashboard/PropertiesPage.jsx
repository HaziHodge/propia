import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import PropertyCard from '../../components/dashboard/PropertyCard';
import PropertyForm from '../../components/dashboard/PropertyForm';
import Modal from '../../components/shared/Modal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Toast from '../../components/shared/Toast';
import { Plus, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchProperties = async () => {
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
  }, []);

  const handleCreateProperty = async (data) => {
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
