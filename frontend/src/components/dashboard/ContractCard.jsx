import React from 'react';
import { FileText, User, Mail, Calendar, Download, Send, Trash2, MapPin } from 'lucide-react';
import { formatCLP } from '../../utils/formatCLP';
import { formatDate } from '../../utils/formatDate';

const ContractCard = ({ contract, onDownload, onResendInvite, onTerminate }) => {
  const statusColors = {
    active: 'bg-success/10 text-success',
    pending_signature: 'bg-primary/10 text-primary',
    terminated: 'bg-slate-100 text-slate-500',
    overdue: 'bg-danger/10 text-danger'
  };

  const statusLabels = {
    active: 'Activo',
    pending_signature: 'Pendiente firma',
    terminated: 'Terminado',
    overdue: 'Atrasado'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:border-slate-300">
      <div className="md:w-72 p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
           <MapPin size={16} />
           <span className="text-[10px] uppercase font-bold tracking-wider">Propiedad</span>
        </div>
        <h4 className="font-bold text-slate-800 leading-tight mb-4">{contract.property_address}</h4>
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[contract.status]}`}>
          {statusLabels[contract.status]}
        </div>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
           <div className="flex items-center gap-2 text-slate-400 mb-3">
             <User size={16} />
             <span className="text-[10px] uppercase font-bold tracking-wider">Arrendatario</span>
           </div>
           <p className="font-bold text-slate-800 mb-1">{contract.tenant_name}</p>
           <p className="text-sm text-slate-500 flex items-center gap-2 italic">
             <Mail size={14} /> {contract.tenant_email}
           </p>
        </div>

        <div>
           <div className="flex items-center gap-2 text-slate-400 mb-3">
             <Calendar size={16} />
             <span className="text-[10px] uppercase font-bold tracking-wider">Periodo & Renta</span>
           </div>
           <p className="font-bold text-slate-800 mb-1">{formatDate(contract.start_date, 'MMM yyyy')} — {formatDate(contract.end_date, 'MMM yyyy')}</p>
           <p className="text-sm text-primary font-bold">{formatCLP(contract.rent_amount)} <span className="text-slate-400 font-normal">/ mes (día {contract.payment_day})</span></p>
        </div>
      </div>

      <div className="p-6 bg-slate-50/50 flex flex-row md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100">
        <button
          onClick={() => onDownload(contract.id)}
          className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 text-sm font-bold"
          title="Descargar PDF"
        >
          <Download size={18} /> <span className="md:hidden">Descargar</span>
        </button>
        {contract.status === 'pending_signature' && (
          <button
            onClick={() => onResendInvite(contract.id)}
            className="flex-1 p-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2 text-sm font-bold"
            title="Reenviar invitación"
          >
            <Send size={18} /> <span className="md:hidden">Reenviar</span>
          </button>
        )}
        {contract.status === 'active' && (
          <button
            onClick={() => onTerminate(contract.id)}
            className="flex-1 p-2.5 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-all flex items-center justify-center gap-2 text-sm font-bold"
            title="Terminar contrato"
          >
            <Trash2 size={18} /> <span className="md:hidden">Terminar</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ContractCard;
