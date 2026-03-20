import React from 'react';
import { ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCLP } from '../../utils/formatCLP';
import { formatDate } from '../../utils/formatDate';

const PaymentRow = ({ payment, onGenerateLink, onMarkPaid }) => {
  const statusConfig = {
    paid: { icon: <CheckCircle size={16} />, color: 'bg-success/10 text-success', label: 'Pagado' },
    pending: { icon: <Clock size={16} />, color: 'bg-warning/10 text-warning', label: 'Pendiente' },
    overdue: { icon: <AlertCircle size={16} />, color: 'bg-danger/10 text-danger', label: 'Atrasado' },
  };

  const currentStatus = statusConfig[payment.status] || statusConfig.pending;

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
      <td className="px-6 py-5">
        <p className="font-bold text-slate-800 text-sm truncate">{payment.property_address}</p>
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">{payment.period_month}/{payment.period_year}</p>
      </td>
      <td className="px-6 py-5 text-sm font-extrabold text-slate-900">{formatCLP(payment.amount)}</td>
      <td className="px-6 py-5">
        <p className="text-sm text-slate-600 font-medium">{formatDate(payment.due_date, 'dd/MM/yyyy')}</p>
      </td>
      <td className="px-6 py-5">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${currentStatus.color}`}>
          {currentStatus.icon}
          {currentStatus.label}
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {payment.status !== 'paid' && (
            <>
              <button
                onClick={() => onGenerateLink(payment.id)}
                className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all shadow-sm"
                title="Generar Link Khipu"
              >
                <ExternalLink size={16} />
              </button>
              <button
                onClick={() => onMarkPaid(payment.id)}
                className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-all shadow-sm"
                title="Marcar como pagado"
              >
                <CheckCircle size={16} />
              </button>
            </>
          )}
          {payment.status === 'paid' && (
             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">Liquidado</span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default PaymentRow;
