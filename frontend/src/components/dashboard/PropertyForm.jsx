import React, { useState } from 'react';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const PropertyForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    address: '',
    commune: '',
    region: 'Región Metropolitana',
    property_type: 'departamento',
    bedrooms: 1,
    bathrooms: 1,
    area_m2: 50
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Dirección</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Av. Providencia 1234 Depto 52"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Comuna</label>
          <input
            name="commune"
            value={formData.commune}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Providencia"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Región</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            <option value="Región Metropolitana">Región Metropolitana</option>
            <option value="Valparaíso">Valparaíso</option>
            <option value="Biobío">Biobío</option>
            <option value="Antofagasta">Antofagasta</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Tipo</label>
          <select
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            <option value="departamento">Depto</option>
            <option value="casa">Casa</option>
            <option value="oficina">Oficina</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Piezas</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Baños</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Área m²</label>
          <input
            type="number"
            name="area_m2"
            value={formData.area_m2}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            min="1"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-2 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-10 rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
        >
          {loading ? <LoadingSpinner size={20} className="text-white" /> : 'Guardar propiedad'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
