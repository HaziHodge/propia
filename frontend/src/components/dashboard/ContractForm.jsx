import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { formatRut } from '../../utils/formatRut';
import { addMonths, format } from 'date-fns';

const ContractForm = ({ properties, onSubmit, onCancel, loading, initialPropertyId }) => {
  const [formData, setFormData] = useState({
    property_id: initialPropertyId || '',
    tenant_name: '',
    tenant_rut: '',
    tenant_email: '',
    tenant_phone: '',
    rent_amount: 500000,
    rent_currency: 'CLP',
    payment_day: 5,
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(addMonths(new Date(), 12), 'yyyy-MM-dd'),
    deposit_months: 1,
    deposit_amount: 500000,
    notes: ''
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, deposit_amount: prev.rent_amount * prev.deposit_months }));
  }, [formData.rent_amount, formData.deposit_months]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tenant_rut') {
      setFormData(prev => ({ ...prev, [name]: formatRut(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Propiedad</label>
        <select
          name="property_id"
          value={formData.property_id}
          onChange={handleChange}
          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none bg-white font-bold text-slate-800"
          required
        >
          <option value="">Selecciona una propiedad</option>
          {properties.filter(p => !p.active_contract_status).map(p => (
            <option key={p.id} value={p.id}>{p.address}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2"><h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Información del Arrendatario</h4></div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Nombre Completo</label>
          <input name="tenant_name" value={formData.tenant_name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">RUT</label>
          <input name="tenant_rut" value={formData.tenant_rut} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary outline-none" placeholder="12.345.678-9" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Email</label>
          <input name="tenant_email" type="email" value={formData.tenant_email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Teléfono</label>
          <input name="tenant_phone" value={formData.tenant_phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary outline-none" />
        </div>

        <div className="md:col-span-2 pt-4"><h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Términos del Contrato</h4></div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Renta Mensual (CLP)</label>
          <input name="rent_amount" type="number" value={formData.rent_amount} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Día de Pago</label>
          <input name="payment_day" type="number" value={formData.payment_day} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary outline-none" min="1" max="28" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Fecha Inicio</label>
          <input name="start_date" type="date" value={formData.start_date} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Fecha Término</label>
          <input name="end_date" type="date" value={formData.end_date} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Meses de Garantía</label>
          <input name="deposit_months" type="number" value={formData.deposit_months} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary outline-none" min="0" max="3" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 italic">Monto Garantía (Auto)</label>
          <input name="deposit_amount" type="number" value={formData.deposit_amount} readOnly className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none" />
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button type="button" onClick={onCancel} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-all">Cancelar</button>
        <button type="submit" disabled={loading} className="flex-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
          {loading ? <LoadingSpinner size={20} className="text-white" /> : 'Generar Contrato'}
        </button>
      </div>
    </form>
  );
};

export default ContractForm;
