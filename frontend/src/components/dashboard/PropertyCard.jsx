import React from 'react';
import { Building, Bath, Bed, Maximize, FileText, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, onCreateContract }) => {
  const statusColors = {
    active: 'bg-success/10 text-success',
    pending_signature: 'bg-primary/10 text-primary',
    default: 'bg-slate-100 text-slate-500'
  };

  const statusLabels = {
    active: 'Arrendada',
    pending_signature: 'Pendiente de firma',
    default: 'Disponible'
  };

  const currentStatus = property.active_contract_status || 'default';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-primary/40 transition-all group">
      <div className="h-48 bg-slate-100 flex items-center justify-center relative group-hover:bg-slate-200 transition-colors">
        <Building size={48} className="text-slate-300" />
        <span className={`absolute top-4 right-4 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${statusColors[currentStatus]}`}>
          {statusLabels[currentStatus]}
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{property.address}</h3>
        <p className="text-sm text-slate-500 mb-6">{property.commune}, {property.region}</p>

        <div className="flex items-center gap-6 mb-8 text-slate-500">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Bed size={16} className="text-slate-400" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Bath size={16} className="text-slate-400" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Maximize size={16} className="text-slate-400" />
            <span>{property.area_m2}m²</span>
          </div>
        </div>

        {currentStatus === 'default' ? (
          <button
            onClick={() => onCreateContract(property.id)}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20"
          >
            <PlusCircle size={18} /> Crear contrato
          </button>
        ) : (
          <Link
            to="/dashboard/contracts"
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <FileText size={18} /> Ver contrato
          </Link>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
