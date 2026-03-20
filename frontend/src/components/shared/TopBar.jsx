import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { User } from 'lucide-react';

const TopBar = ({ title }) => {
  const owner = useAuthStore(state => state.owner);

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-8">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">{owner?.name}</p>
          <p className="text-xs text-slate-500 uppercase">{owner?.plan}</p>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <User size={24} />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
