import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building, FileText, CreditCard, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const logout = useAuthStore(state => state.logout);

  const navItems = [
    { to: '/dashboard/home', icon: <Home size={20} />, label: 'Inicio' },
    { to: '/dashboard/properties', icon: <Building size={20} />, label: 'Propiedades' },
    { to: '/dashboard/contracts', icon: <FileText size={20} />, label: 'Contratos' },
    { to: '/dashboard/payments', icon: <CreditCard size={20} />, label: 'Pagos' },
    { to: '/dashboard/settings', icon: <Settings size={20} />, label: 'Configuración' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">PagoRenta</h1>
        <p className="text-xs text-slate-400">Arriendos sin corretaje</p>
      </div>

      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive ? 'bg-primary/20 border-l-4 border-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mt-auto border-t border-slate-800"
      >
        <LogOut size={20} />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
};

export default Sidebar;
