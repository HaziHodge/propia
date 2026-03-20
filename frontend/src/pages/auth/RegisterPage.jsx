import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import Toast from '../../components/shared/Toast';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { formatRut, validateRut } from '../../utils/formatRut';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rut') {
      setFormData(prev => ({ ...prev, [name]: formatRut(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateRut(formData.rut)) {
      setError('El RUT ingresado no es válido');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', formData);
      setAuth(response.data.token, response.data.owner);
      setSuccess('Registro exitoso. ¡Bienvenido!');
      setTimeout(() => navigate('/dashboard/home'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-inter">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 border border-slate-100">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl italic">P</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">PagoRenta</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Crea tu cuenta gratis</h2>
          <p className="text-slate-500 mt-2">Empieza a gestionar tus arriendos hoy</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre Completo</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">RUT</label>
              <input
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="12.345.678-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="nombre@ejemplo.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono (opcional)</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size={20} className="text-white" /> : 'Crear cuenta gratis'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-primary font-bold hover:underline">Inicia sesión</Link>
        </p>
      </div>
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
    </div>
  );
};

export default RegisterPage;
