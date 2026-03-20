import React from 'react';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';

const TenantPaymentSuccessPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter text-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-12 border border-slate-100 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-success animate-pulse"></div>
        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-10 mx-auto shadow-xl shadow-success/20 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase tracking-tight">¡Pago Exitoso!</h2>
        <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-md mx-auto">Tu pago de arriendo ha sido procesado correctamente. Recibirás un comprobante en tu correo electrónico en los próximos minutos.</p>

        <div className="space-y-4">
           <button
             className="w-full bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/30 flex items-center justify-center gap-3"
             onClick={() => window.close()}
           >
             Cerrar Ventana <ArrowRight size={22} />
           </button>
           <p className="text-sm font-bold text-slate-400 italic flex items-center justify-center gap-2 mt-6">
             <Mail size={16} /> Comprobante enviado a tu email
           </p>
        </div>
      </div>
    </div>
  );
};

export default TenantPaymentSuccessPage;
