import React from 'react';
import { FileText, User, Building, Calendar, DollarSign, ShieldAlert, Download } from 'lucide-react';
import { formatCLP } from '../../utils/formatCLP';
import { formatDate } from '../../utils/formatDate';

const ContractViewer = ({ contract }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-slide-up max-w-4xl mx-auto">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
        <div>
           <div className="flex items-center gap-2 text-slate-400 mb-2">
             <FileText size={18} />
             <span className="text-[10px] uppercase font-black tracking-widest">Contrato Digital</span>
           </div>
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Revisión de Contrato</h3>
        </div>
        <button
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:text-primary hover:border-primary transition-all shadow-sm"
          onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/tenant/contract/pdf/${contract.id}`, '_blank')}
        >
          <Download size={18} /> Ver PDF Completo
        </button>
      </div>

      <div className="p-8 md:p-12 space-y-12">
        <section className="grid md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={16} /> Partes Involucradas
            </h4>
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Propietario</p>
                <p className="font-bold text-slate-800 text-lg">{contract.owner_name}</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-[10px] uppercase font-bold text-primary mb-1">Arrendatario</p>
                <p className="font-bold text-slate-800 text-lg">{contract.tenant_name}</p>
                <p className="text-sm text-slate-500 font-medium">RUT: {contract.tenant_rut}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Building size={16} /> Propiedad
            </h4>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 h-full flex flex-col justify-center">
              <p className="font-bold text-slate-800 text-xl leading-tight mb-2 italic">{contract.address}</p>
              <p className="text-slate-500 font-medium uppercase tracking-tighter text-sm mb-4">{contract.commune}, {contract.region}</p>
              <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-4 mt-2">
                 <div className="text-center"><p className="text-[10px] font-bold text-slate-400 uppercase">Dorm.</p><p className="font-bold text-slate-800">{contract.bedrooms}</p></div>
                 <div className="text-center border-x border-slate-200"><p className="text-[10px] font-bold text-slate-400 uppercase">Baños</p><p className="font-bold text-slate-800">{contract.bathrooms}</p></div>
                 <div className="text-center"><p className="text-[10px] font-bold text-slate-400 uppercase">m²</p><p className="font-bold text-slate-800">{contract.area_m2}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <DollarSign size={16} /> Términos Financieros
          </h4>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center gap-2">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Renta Mensual</p>
               <p className="text-2xl font-black text-primary">{formatCLP(contract.rent_amount)}</p>
               <p className="text-[10px] font-bold text-slate-500 italic uppercase">Paga el día {contract.payment_day} de cada mes</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center gap-2">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Garantía</p>
               <p className="text-2xl font-black text-slate-800">{formatCLP(contract.deposit_amount)}</p>
               <p className="text-[10px] font-bold text-slate-500 italic uppercase">{contract.deposit_months} mes(es) de depósito</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center gap-2">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duración</p>
               <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                 {formatDate(contract.start_date, 'MMM yyyy')} - {formatDate(contract.end_date, 'MMM yyyy')}
               </p>
               <p className="text-[10px] font-bold text-slate-500 italic uppercase tracking-widest">12 Meses plazo fijo</p>
            </div>
          </div>
        </section>

        <section className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
          <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <Shield size={16} /> Cláusulas Clave
          </h4>
          <ul className="space-y-4 text-sm text-slate-700">
             <li className="flex gap-3">
               <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
               <p>El inmueble se destinará exclusivamente a fines habitacionales del Arrendatario y su grupo familiar.</p>
             </li>
             <li className="flex gap-3">
               <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
               <p>Los pagos deben realizarse vía PagoRenta/Khipu antes de la fecha de vencimiento acordada.</p>
             </li>
             <li className="flex gap-3">
               <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
               <p>El retraso en el pago generará intereses moratorios según la tasa máxima convencional.</p>
             </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

import { Shield } from 'lucide-react';
export default ContractViewer;
