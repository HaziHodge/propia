import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  Play,
  ArrowRight,
  Building,
  ClipboardCheck,
  UserCheck,
  CreditCard,
  Lock,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Smartphone,
  CheckCircle2,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const LandingPage = () => {
  const navigate = useNavigate();
  const setDemoMode = useAuthStore(state => state.setDemoMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    // 1. IntersectionObserver — reveal on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el))

    // 2. Animated number counter
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target
            const target = parseFloat(el.dataset.target)
            const duration = 2000
            const step = target / (duration / 16)
            let current = 0
            const timer = setInterval(() => {
              current += step
              if (current >= target) {
                current = target
                clearInterval(timer)
              }
              const formatted = el.dataset.isCurrency
                ? '$' + Math.floor(current).toLocaleString('es-CL') + (el.dataset.suffix || '')
                : Math.floor(current).toLocaleString('es-CL') + (el.dataset.suffix || '')
              el.textContent = formatted
            }, 16)
            countObserver.unobserve(el)
          }
        })
      },
      { threshold: 0.5 }
    )
    document.querySelectorAll('[data-target]').forEach(el => countObserver.observe(el))

    // 3. Navbar scroll effect
    const nav = document.getElementById('navbar')
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('bg-dark/95', 'backdrop-blur-md', 'border-b', 'border-white/10', 'py-3')
        nav.classList.remove('py-5')
      } else {
        nav.classList.remove('bg-dark/95', 'backdrop-blur-md', 'border-b', 'border-white/10', 'py-3')
        nav.classList.add('py-5')
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      observer.disconnect()
      countObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleDemo = () => {
    setDemoMode(true);
    navigate('/dashboard/home');
  };

  const plans = [
    {
      name: 'Básico',
      price: billingCycle === 'monthly' ? 19900 : 16500,
      features: ['1 propiedad', 'Contrato digital', 'Cobro con Khipu', 'Soporte por email']
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? 34900 : 29000,
      popular: true,
      features: ['Hasta 3 propiedades', 'Historial completo', 'Alertas de mora', 'Soporte prioritario', 'Personalización']
    },
    {
      name: 'Inversor',
      price: billingCycle === 'monthly' ? 59900 : 49900,
      features: ['Hasta 10 propiedades', 'Reportes exportables', 'API access', 'Onboarding personal', 'Múltiples usuarios']
    }
  ];

  return (
    <div className="bg-dark text-white min-h-screen font-inter selection:bg-gold selection:text-dark">
      {/* Animated SVG Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Decorative Elements */}
      <div className="fixed bottom-0 right-0 w-1/2 h-1/2 pointer-events-none z-0 hidden lg:block">
        <div className="absolute bottom-20 right-20 w-64 h-96 border border-white/5 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-40 right-40 w-80 h-80 border border-white/5 animate-float" style={{ animationDelay: '1s', transform: 'rotate(15deg)' }}></div>
        <div className="absolute bottom-10 right-60 w-48 h-64 border border-white/5 animate-float" style={{ animationDelay: '2s', transform: 'rotate(-10deg)' }}></div>
      </div>

      {/* Navbar */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-5 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-primary-dark font-black text-xl italic shadow-lg shadow-gold/20">P</div>
          <span className="text-2xl font-bold font-playfair tracking-tight">PagoRenta</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#producto" className="text-sm font-medium hover:text-gold transition-colors">Producto</a>
          <a href="#precios" className="text-sm font-medium hover:text-gold transition-colors">Precios</a>
          <a href="#funciona" className="text-sm font-medium hover:text-gold transition-colors">Cómo funciona</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold hover:text-gold transition-colors px-4 py-2">Iniciar sesión</Link>
          <Link to="/register" className="bg-gold text-dark font-black text-sm px-6 py-2.5 rounded-full hover:scale-105 transition-all shadow-lg shadow-gold/20">Empieza gratis</Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-dark border-b border-white/10 p-6 flex flex-col gap-6 md:hidden animate-fade-up">
            <a href="#producto" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Producto</a>
            <a href="#precios" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Precios</a>
            <a href="#funciona" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Cómo funciona</a>
            <hr className="border-white/10" />
            <Link to="/login" className="text-lg font-bold">Iniciar sesión</Link>
            <Link to="/register" className="bg-gold text-dark text-center font-black text-lg px-6 py-4 rounded-xl">Empieza gratis</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 overflow-hidden z-10">
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-gold/30 rounded-full px-4 py-2 mb-8 animate-fade-up">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
             </span>
             <span className="text-xs font-black text-gold uppercase tracking-widest italic">🇨🇱 Diseñado para Chile · Sin corretaje</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black font-playfair leading-[1.1] mb-8">
            <span className="block animate-fade-up" style={{ animationDelay: '0s' }}>Arrienda sin</span>
            <span className="block animate-fade-up" style={{ animationDelay: '0.1s' }}>corredora.</span>
            <span className="block animate-fade-up italic text-gold" style={{ animationDelay: '0.2s' }}>Cobra sin</span>
            <span className="block animate-fade-up italic text-gold" style={{ animationDelay: '0.3s' }}>preocuparte.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-up" style={{ animationDelay: '0.4s' }}>
            Contrato digital con validez legal, cobro automático vía Khipu y gestión completa. El estándar de oro para el propietario moderno.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <Link to="/register" className="w-full sm:w-auto bg-gold text-dark font-black text-lg px-10 py-5 rounded-full hover:scale-105 transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2">
              Empieza gratis 14 días <ArrowRight size={20} />
            </Link>
            <button onClick={handleDemo} className="w-full sm:w-auto border border-white/20 text-white font-bold text-lg px-10 py-5 rounded-full hover:bg-white hover:text-dark transition-all flex items-center justify-center gap-2">
              <Play size={18} fill="currentColor" /> Ver demo
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-white/40 text-xs font-bold uppercase tracking-widest animate-fade-up" style={{ animationDelay: '0.6s' }}>
             <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-gold" /> Sin tarjeta</span>
             <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-gold" /> Cancela cuando quieras</span>
          </div>
        </div>

        {/* Right Side Mockup */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none animate-fade-right" style={{ animationDelay: '0.7s' }}>
          <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 animate-float z-10 relative">
             <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                <div className="h-10 bg-white border-b border-slate-100 flex items-center px-4 gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                </div>
                <div className="flex">
                   <div className="w-32 md:w-40 bg-slate-900 h-64 p-4 space-y-4">
                      <div className="w-full h-2 bg-white/10 rounded"></div>
                      <div className="w-3/4 h-2 bg-white/10 rounded"></div>
                      <div className="w-5/6 h-2 bg-primary rounded shadow-sm shadow-primary/40"></div>
                   </div>
                   <div className="flex-1 p-6 space-y-6">
                      <div className="flex gap-3">
                         <div className="w-full h-12 bg-white rounded-xl border border-slate-100 p-2">
                            <div className="w-1/2 h-1.5 bg-slate-100 rounded mb-2"></div>
                            <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
                         </div>
                         <div className="w-full h-12 bg-white rounded-xl border border-slate-100 p-2">
                            <div className="w-1/2 h-1.5 bg-slate-100 rounded mb-2"></div>
                            <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="h-10 bg-white rounded-xl border border-slate-100 flex items-center px-4">
                            <div className="w-full h-2 bg-slate-50 rounded"></div>
                         </div>
                         <div className="h-10 bg-white rounded-xl border border-slate-100 flex items-center px-4">
                            <div className="w-full h-2 bg-slate-50 rounded"></div>
                         </div>
                      </div>
                      <div className="bg-success/10 text-success text-[10px] font-bold py-2 px-4 rounded-full inline-flex items-center gap-2 animate-bounce">
                         <CheckCircle2 size={12} /> Pago recibido: Mesa 1, Providencia
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Floating Small Cards */}
          <div className="absolute -bottom-10 -left-10 bg-dark border border-white/10 p-5 rounded-2xl shadow-2xl animate-float z-20" style={{ animationDelay: '1.5s' }}>
             <p className="text-gold font-black text-xl">$550.000</p>
             <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Cobrado hoy</p>
          </div>
          <div className="absolute -top-10 -right-5 bg-primary text-white p-5 rounded-2xl shadow-2xl animate-float z-0" style={{ animationDelay: '2.5s' }}>
             <p className="font-bold flex items-center gap-2"><Check size={16} /> Contrato activo</p>
             <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-1">Mesa 1, Providencia</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-dark/50 border-y border-white/5 py-16 md:py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
           {[
             { target: 2400000, suffix: '+', label: 'Propiedades en arriendo Chile' },
             { target: 78, suffix: '%', label: 'Propietarios sin herramienta digital' },
             { target: 340000, suffix: '', label: 'Ahorro promedio vs corredora (3 años)', isCurrency: true },
             { target: 9, suffix: '.2/10', label: 'Validación de mercado' },
           ].map((stat, idx) => (
             <div key={idx} className="space-y-3 relative after:absolute after:right-[-24px] after:top-1/4 after:bottom-1/4 after:w-[1px] after:bg-white/10 after:hidden md:after:block last:after:hidden">
               <p className="text-4xl md:text-5xl font-black font-playfair text-gold tracking-tighter" data-target={stat.target} data-suffix={stat.suffix} data-is-currency={stat.isCurrency}>0</p>
               <p className="text-xs font-bold text-white/40 uppercase tracking-widest max-w-[150px] mx-auto">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Pain Points */}
      <section id="producto" className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 reveal">
            <h2 className="text-4xl md:text-6xl font-black font-playfair text-dark mb-6 tracking-tight italic">¿Reconoces esta situación?</h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">Gestionar arriendos manualmente es un sumidero de tiempo y dinero que ya no deberías tolerar.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
             {[
               { icon: <Smartphone />, title: "Persigues el arriendo por WhatsApp", desc: "Cada mes el mismo ritual: un mensaje, una transferencia, ninguna certeza." },
               { icon: <ClipboardCheck />, title: "Contratos impresos que se pierden", desc: "Firmados a mano, sin copia digital, sin validez clara si hay un problema." },
               { icon: <DollarSign />, title: "Pagas $500.000+ a la corredora", desc: "Cada vez que cambia el arrendatario. Para que hagan lo que harías tú en 30 minutos." }
             ].map((card, idx) => (
               <div key={idx} className="bg-slate-50 p-10 rounded-3xl border-l-8 border-gold hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group reveal" style={{ animationDelay: `${idx * 0.2}s` }}>
                  <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gold group-hover:text-white transition-colors">
                     {card.icon}
                  </div>
                  <h3 className="text-2xl font-black font-playfair text-dark mb-4 leading-tight">{card.title}</h3>
                  <p className="text-text-muted leading-relaxed">{card.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="funciona" className="bg-gray-soft py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24 reveal">
            <h2 className="text-4xl md:text-6xl font-black font-playfair text-dark mb-6 tracking-tight italic">Así de simple. En serio.</h2>
            <p className="text-lg text-text-muted">Digitaliza tu portafolio en cuestión de minutos.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
             {/* Animated Dashed Line Connector (Desktop only) */}
             <div className="hidden lg:block absolute top-[110px] left-[10%] right-[10%] h-[2px] z-0">
               <svg width="100%" height="2" className="w-full">
                 <line x1="0" y1="1" x2="100%" y2="1" stroke="#F39C12" strokeWidth="2" strokeDasharray="8" className="dashed-connector" />
               </svg>
             </div>

             {[
               { icon: <Building />, title: "Agrega tu propiedad", desc: "Solo necesitas la dirección y los datos básicos." },
               { icon: <Briefcase />, title: "Genera el contrato", desc: "Términos legales automatizados y personalizables." },
               { icon: <UserCheck />, title: "El arrendatario firma", desc: "Desde su celular, con validez legal certificada." },
               { icon: <CreditCard />, title: "Cobro automático", desc: "Khipu procesa el pago y te notifica al instante." }
             ].map((step, idx) => (
               <div key={idx} className="flex flex-col items-center text-center reveal" style={{ animationDelay: `${idx * 0.15}s` }}>
                  <div className="w-20 h-20 bg-dark rounded-full flex items-center justify-center text-gold mb-8 relative z-10 shadow-xl border-4 border-white">
                     {step.icon}
                     <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold text-dark rounded-full flex items-center justify-center font-black text-sm">{idx + 1}</div>
                  </div>
                  <h4 className="text-xl font-black text-dark mb-3 tracking-tight">{step.title}</h4>
                  <p className="text-text-muted text-sm leading-relaxed px-4">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl md:text-6xl font-black font-playfair text-dark mb-6 tracking-tight italic">Precios claros, sin sorpresas</h2>
            <p className="text-lg text-text-muted mb-10">Todos los planes incluyen 14 días de prueba gratuita.</p>

            <div className="flex items-center justify-center gap-6">
               <span className={`text-sm font-bold uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-dark' : 'text-text-muted opacity-50'}`}>Mensual</span>
               <button
                 onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                 className="w-16 h-8 bg-dark rounded-full relative p-1 transition-all"
               >
                 <div className={`w-6 h-6 bg-gold rounded-full transition-all duration-300 ${billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-0'}`}></div>
               </button>
               <span className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${billingCycle === 'annual' ? 'text-dark' : 'text-text-muted opacity-50'}`}>
                 Anual <span className="bg-success text-white text-[10px] px-2 py-0.5 rounded-full">2 meses gratis</span>
               </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 items-center">
             {plans.map((plan, idx) => (
               <div key={idx} className={`p-10 rounded-[40px] border transition-all duration-500 reveal ${
                 plan.popular
                  ? 'bg-dark text-white border-gold shadow-2xl lg:py-16 ring-8 ring-gold/5'
                  : 'bg-slate-50 text-dark border-slate-100 hover:border-gold/30'
               }`}>
                  {plan.popular && <span className="bg-gold text-dark font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 inline-block">★ Más Popular</span>}
                  <h3 className="text-2xl font-black font-playfair mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-10">
                     <span className={`text-5xl font-black ${plan.popular ? 'text-gold' : 'text-dark'}`}>${plan.price.toLocaleString('es-CL')}</span>
                     <span className={`${plan.popular ? 'text-white/40' : 'text-text-muted'} font-bold`}>/mes</span>
                  </div>

                  <ul className="space-y-6 mb-12">
                     {plan.features.map((f, i) => (
                       <li key={i} className="flex items-center gap-3 text-sm font-medium">
                         <Check size={18} className="text-gold" /> {f}
                       </li>
                     ))}
                  </ul>

                  <Link to="/register" className={`block text-center py-5 rounded-2xl font-black text-lg transition-all ${
                    plan.popular
                      ? 'bg-gold text-dark hover:scale-105 shadow-xl shadow-gold/20'
                      : 'bg-dark text-white hover:bg-slate-800'
                  }`}>
                    Seleccionar Plan
                  </Link>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-primary py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 relative z-10">
           {[
             { icon: <Lock />, title: "Validez legal", desc: "Contratos amparados por la Ley 19.799 sobre documentos electrónicos en Chile." },
             { icon: <UserCheck />, title: "Pagos 100% chilenos", desc: "Integración nativa con Khipu y Flow. Transacciones rápidas y seguras." },
             { icon: <ShieldCheck />, title: "Datos protegidos", desc: "Cumplimos con la Ley 19.628 de protección de datos de carácter personal." }
           ].map((item, idx) => (
             <div key={idx} className="flex-1 flex flex-col items-center md:items-start text-center md:text-left reveal" style={{ animationDelay: `${idx * 0.2}s` }}>
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-primary-dark mb-8 shadow-xl">
                   {item.icon}
                </div>
                <h3 className="text-2xl font-black font-playfair mb-4 text-white italic tracking-tight">{item.title}</h3>
                <p className="text-white/70 leading-relaxed text-sm">{item.desc}</p>
             </div>
           ))}
        </div>
        {/* Background gradient flare */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
      </section>

      {/* Final CTA */}
      <section className="bg-dark py-40 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 reveal">
          <h2 className="text-5xl md:text-8xl font-black font-playfair mb-8 italic tracking-tighter leading-none">
            Tu arriendo.<br />
            <span className="text-gold">Tu control.</span>
          </h2>
          <p className="text-xl text-white/50 mb-12 max-w-xl mx-auto leading-relaxed italic">Únete a cientos de propietarios que ya eliminaron la comisión de corretaje para siempre.</p>

          <Link to="/register" className="bg-gold text-dark font-black text-xl px-12 py-6 rounded-full inline-flex items-center gap-3 hover:scale-110 hover:rotate-2 transition-all shadow-2xl shadow-gold/30 pulse-ring">
            Empieza gratis hoy <ChevronRight />
          </Link>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/30 text-xs font-black uppercase tracking-[0.2em]">
             <span>Sin tarjeta</span>
             <span>Sin instalación</span>
             <span>Sin sorpresas</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark border-t border-white/5 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8 opacity-80">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-dark font-black text-sm italic">P</div>
              <span className="text-xl font-bold font-playfair">PagoRenta</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-8 italic">Reinventando la gestión inmobiliaria en Chile con tecnología y transparencia.</p>
            <p className="text-xs text-white/20 font-bold uppercase tracking-widest">© 2026 PagoRenta SpA</p>
          </div>

          {[
            { title: "Producto", links: ["Características", "Seguridad", "Khipu", "API"] },
            { title: "Legal", links: ["Privacidad", "Términos", "Cookies", "Ley 19.799"] },
            { title: "Contacto", links: ["Soporte", "Comunidad", "LinkedIn", "Twitter"] }
          ].map((col, idx) => (
            <div key={idx} className="col-span-1">
               <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gold mb-8">{col.title}</h4>
               <ul className="space-y-4">
                  {col.links.map((link, i) => (
                    <li key={i}><a href="#" className="text-sm text-white/40 hover:text-gold transition-colors font-medium">{link}</a></li>
                  ))}
               </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
