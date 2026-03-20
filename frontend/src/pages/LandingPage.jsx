import React from 'react';
import { Link } from 'react-router-dom';
import { Check, CheckCircle2, DollarSign, FileCheck, ShieldCheck, Users } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl italic">P</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">PagoRenta</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-slate-600 font-semibold hover:text-primary transition-colors">Iniciar sesión</Link>
          <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-md shadow-primary/20">Empieza gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-24 text-center max-w-5xl mx-auto">
        <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6 tracking-wide uppercase">🇨🇱 Diseñado para Chile</span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">Arrienda tu propiedad sin corredora, sin complicaciones</h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">Contrato digital, cobro automático y gestión completa de tus arriendos. Todo en un solo lugar.</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link to="/register" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white text-lg px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-primary/30">Empieza gratis 14 días →</Link>
        </div>

        <p className="text-slate-400 text-sm flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5"><Check size={16} /> Sin tarjeta de crédito</span>
          <span className="flex items-center gap-1.5"><Check size={16} /> Cancela cuando quieras</span>
        </p>

        {/* Dashboard Mockup Placeholder */}
        <div className="mt-20 mx-auto max-w-4xl bg-slate-100 rounded-2xl p-4 border border-slate-200 shadow-2xl relative">
          <div className="bg-white rounded-xl h-96 flex flex-col overflow-hidden border border-slate-200">
            <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            </div>
            <div className="flex-1 flex">
              <div className="w-48 bg-slate-900 h-full p-4 flex flex-col gap-3">
                <div className="w-full h-4 bg-slate-700 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-slate-700 rounded animate-pulse"></div>
                <div className="w-5/6 h-4 bg-slate-700 rounded animate-pulse"></div>
              </div>
              <div className="flex-1 p-6 flex flex-col gap-6 bg-slate-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm h-24 border border-slate-100"></div>
                  <div className="bg-white p-4 rounded-lg shadow-sm h-24 border border-slate-100"></div>
                  <div className="bg-white p-4 rounded-lg shadow-sm h-24 border border-slate-100"></div>
                </div>
                <div className="bg-white flex-1 rounded-lg shadow-sm border border-slate-100"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">¿Cansado de esto?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-danger/10 text-danger rounded-xl flex items-center justify-center mb-6">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Comisiones excesivas</h3>
              <p className="text-slate-600">Pagar 1 mes de comisión a la corredora ($300.000 - $800.000) cada vez que buscas arrendatario.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-danger/10 text-danger rounded-xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Cobranzas infinitas</h3>
              <p className="text-slate-600">Perseguir el arriendo todos los meses por WhatsApp o teléfono. El sistema cobra por ti.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-danger/10 text-danger rounded-xl flex items-center justify-center mb-6">
                <FileCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Inseguridad legal</h3>
              <p className="text-slate-600">Contratos firmados a mano que se pierden o no tienen validez clara. Todo centralizado y legal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">Así de simple</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {[
              { step: 1, title: 'Crea tu propiedad', desc: 'En 2 minutos con los datos básicos.' },
              { step: 2, title: 'Genera el contrato', desc: 'Sube los términos y envíalo al tenant.' },
              { step: 3, title: 'Firma online', desc: 'El arrendatario firma desde su celular.' },
              { step: 4, title: 'Recibe pagos', desc: 'Automáticamente cada mes vía Khipu.' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-6 text-lg">{item.step}</div>
                <h3 className="font-bold text-lg mb-2 text-slate-800">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-slate-900 py-24 px-6 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Planes para cada necesidad</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all">
              <h3 className="text-xl font-bold mb-2">Básico</h3>
              <p className="text-4xl font-extrabold mb-6">$19.900<span className="text-sm font-normal text-slate-400">/mes</span></p>
              <ul className="space-y-4 mb-10 text-slate-300">
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> 1 propiedad</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> Contrato digital</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> Cobro con Khipu</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> Soporte por email</li>
              </ul>
              <Link to="/register" className="block text-center bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors">Empezar gratis</Link>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-primary relative transform scale-105 shadow-2xl">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Más Popular</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-extrabold mb-6">$34.900<span className="text-sm font-normal text-slate-400">/mes</span></p>
              <ul className="space-y-4 mb-10 text-slate-300">
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> Hasta 3 propiedades</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> Historial completo</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> Alertas de mora</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> Soporte prioritario</li>
              </ul>
              <Link to="/register" className="block text-center bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors">Empezar gratis</Link>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all">
              <h3 className="text-xl font-bold mb-2">Inversor</h3>
              <p className="text-4xl font-extrabold mb-6">$59.900<span className="text-sm font-normal text-slate-400">/mes</span></p>
              <ul className="space-y-4 mb-10 text-slate-300">
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> Hasta 10 propiedades</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> Reportes exportables</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> API access</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-primary" /> Onboarding personal</li>
              </ul>
              <Link to="/register" className="block text-center bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors">Contactar</Link>
            </div>
          </div>
          <p className="text-center mt-12 text-slate-500 text-sm">Todos los planes incluyen 14 días gratis. Sin tarjeta de crédito requerida.</p>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="flex flex-col items-center text-center gap-2">
             <ShieldCheck className="text-primary mb-2" size={32} />
             <p className="text-sm font-medium text-slate-600">Contrato con validez legal Ley 19.799</p>
           </div>
           <div className="flex flex-col items-center text-center gap-2">
             <CheckCircle2 className="text-primary mb-2" size={32} />
             <p className="text-sm font-medium text-slate-600">Pagos procesados por Khipu</p>
           </div>
           <div className="flex flex-col items-center text-center gap-2">
             <Users className="text-primary mb-2" size={32} />
             <p className="text-sm font-medium text-slate-600">Tus datos protegidos Ley 19.628</p>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">P</div>
            <span className="font-bold text-slate-900">PagoRenta</span>
          </div>
          <p className="text-slate-500 text-sm italic">© 2026 PagoRenta · Santiago, Chile</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-500 hover:text-primary text-sm transition-colors">Iniciar sesión</Link>
            <Link to="/register" className="text-slate-500 hover:text-primary text-sm transition-colors">Crear cuenta</Link>
            <a href="mailto:contacto@pagorenta.cl" className="text-slate-500 hover:text-primary text-sm transition-colors">contacto@pagorenta.cl</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
