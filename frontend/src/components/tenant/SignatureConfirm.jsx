import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const SignatureConfirm = ({ tenantName, tenantRut, onSubmit, loading }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [name, setName] = useState(tenantName || '');
  const [rut] = useState(tenantRut || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmed) return;
    onSubmit({ tenant_name: name, tenant_rut: rut, signature_confirmed: true });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-2xl overflow-hidden max-w-lg mx-auto animate-fade-in">
      <div className="p-8 bg-primary/10 border-b border-primary/20 text-center flex flex-col items-center">
        <ShieldCheck className="text-primary mb-4" size={48} />
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Firma Digital Simple</h3>
        <p className="text-sm text-slate-600 mt-1">Validez legal bajo Ley 19.799</p>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-8">
        <div className="space-y-4">
           <div>
             <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 italic">Nombre Completo (como aparece en CI)</label>
             <input
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full px-4 py-4 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-slate-800"
               required
             />
           </div>
           <div>
             <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 italic">RUT</label>
             <input
               value={rut}
               readOnly
               className="w-full px-4 py-4 rounded-xl border-2 border-slate-50 bg-slate-50 text-slate-400 outline-none font-bold"
             />
           </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
           <input
             type="checkbox"
             id="confirm"
             checked={confirmed}
             onChange={(e) => setConfirmed(e.target.checked)}
             className="w-6 h-6 mt-0.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
           />
           <label htmlFor="confirm" className="text-sm text-slate-600 leading-relaxed select-none cursor-pointer">
             Confirmo que soy <strong>{name}</strong> con RUT <strong>{rut}</strong> y acepto firmar este contrato digitalmente bajo los términos expuestos anteriormente.
           </label>
        </div>

        <button
          type="submit"
          disabled={!confirmed || loading}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
            confirmed && !loading
              ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/30'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {loading ? <LoadingSpinner size={24} className="text-white" /> : (
            <>Firmar Contrato <UserCheck size={22} /></>
          )}
        </button>

        <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1.5 uppercase font-bold tracking-widest">
           <AlertTriangle size={12} className="text-warning" /> Firma electrónica generada y certificada por PagoRenta.cl
        </p>
      </form>
    </div>
  );
};

export default SignatureConfirm;
