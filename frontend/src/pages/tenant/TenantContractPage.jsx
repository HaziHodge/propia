import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import ContractViewer from '../../components/tenant/ContractViewer';
import SignatureConfirm from '../../components/tenant/SignatureConfirm';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Toast from '../../components/shared/Toast';
import { CheckCircle2, Download, ExternalLink, CreditCard, AlertTriangle } from 'lucide-react';

const TenantContractPage = () => {
  const { token } = useParams();
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [signed, setSigned] = useState(false);
  const [signing, setSigning] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await api.get(`/tenant/contract/${token}`);
        setContractData(res.data);
        if (res.data.alreadySigned) setSigned(true);
      } catch (err) {
        setError(err.response?.data?.error || 'Link inválido o expirado');
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [token]);

  const handleSign = async (payload) => {
    setSigning(true);
    try {
      const res = await api.post(`/tenant/contract/${token}/sign`, payload);
      setSigned(true);
      try {
        const paymentsRes = await api.get(`/tenant/payments/${res.data.contractId}`);
        const firstPayment = paymentsRes.data.find(p => p.status === 'pending');
        if (firstPayment) {
          setPaymentUrl('https://khipu.com/dummy-payment-link');
        }
      } catch (e) { /* ignore */ }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al firmar contrato');
    } finally {
      setSigning(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 font-inter">
      <LoadingSpinner size={64} className="mb-4" />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm animate-pulse">Cargando Contrato Digital...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 font-inter text-center">
      <div className="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-8 shadow-lg shadow-danger/20">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Link Inválido o Expirado</h2>
      <p className="text-slate-500 max-w-md text-lg leading-relaxed mb-10">Este link de invitación ha expirado o no es válido. Por favor contacta al propietario de la propiedad para que te envíe uno nuevo.</p>
      <Link to="/" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/30">Volver al Inicio</Link>
    </div>
  );

  if (signed) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 font-inter animate-fade-in">
      <div className="w-32 h-32 bg-success/10 text-success rounded-full flex items-center justify-center mb-10 shadow-xl shadow-success/20 animate-bounce">
        <CheckCircle2 size={64} />
      </div>
      <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase tracking-tight">¡Contrato Firmado!</h2>
      <p className="text-slate-500 text-lg leading-relaxed mb-12 text-center max-w-lg">Has firmado exitosamente el contrato de arriendo para <strong>{contractData.contract.address}</strong>. Recibirás un recordatorio 3 días antes de cada vencimiento.</p>

      <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <button
          className="bg-white border-2 border-slate-200 text-slate-800 px-8 py-5 rounded-2xl font-black text-lg hover:border-primary hover:text-primary transition-all shadow-lg flex items-center justify-center gap-3"
          onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/tenant/contract/pdf/${contractData.contract.id}`, '_blank')}
        >
          <Download size={24} /> Descargar Contrato
        </button>
        {paymentUrl && (
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
          >
            Pagar Primer Mes <CreditCard size={24} />
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-inter animate-fade-in">
      <div className="max-w-4xl mx-auto mb-12 flex justify-center">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all ${step === 1 ? 'bg-primary text-white ring-4 ring-primary/20 scale-110' : 'bg-success text-white'}`}>1</div>
          <div className={`w-12 h-1 bg-slate-200 rounded-full ${step === 2 ? 'bg-primary' : ''}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all ${step === 2 ? 'bg-primary text-white ring-4 ring-primary/20 scale-110' : 'bg-slate-200 text-slate-400'}`}>2</div>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-10">
          <ContractViewer contract={contractData.contract} property={contractData.property} />
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setStep(2)}
              className="bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 flex items-center gap-3 transition-all"
            >
              Continuar a Firmar <ExternalLink size={24} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-10 animate-fade-in">
          <button
            onClick={() => setStep(1)}
            className="text-slate-500 font-bold hover:text-slate-800 transition-colors flex items-center gap-2 mb-6 mx-auto uppercase tracking-widest text-xs"
          >
            ← Volver a Revisar Contrato
          </button>
          <SignatureConfirm
            tenantName={contractData.contract.tenant_name}
            tenantRut={contractData.contract.tenant_rut}
            onSubmit={handleSign}
            loading={signing}
          />
        </div>
      )}

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
    </div>
  );
};

export default TenantContractPage;
