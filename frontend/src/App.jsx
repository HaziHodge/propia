import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import PropertiesPage from './pages/dashboard/PropertiesPage';
import ContractsPage from './pages/dashboard/ContractsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import TenantContractPage from './pages/tenant/TenantContractPage';
import TenantPaymentSuccessPage from './pages/tenant/TenantPaymentSuccessPage';
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tenant/contract/:token" element={<TenantContractPage />} />
        <Route path="/tenant/payment-success" element={<TenantPaymentSuccessPage />} />

        <Route element={<ProtectedRoute title="Dashboard" />}>
          <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />
          <Route path="/dashboard/home" element={<DashboardHome />} />
        </Route>

        <Route element={<ProtectedRoute title="Propiedades" />}>
          <Route path="/dashboard/properties" element={<PropertiesPage />} />
        </Route>

        <Route element={<ProtectedRoute title="Contratos" />}>
          <Route path="/dashboard/contracts" element={<ContractsPage />} />
        </Route>

        <Route element={<ProtectedRoute title="Pagos" />}>
          <Route path="/dashboard/payments" element={<PaymentsPage />} />
        </Route>

        <Route element={<ProtectedRoute title="Configuración" />}>
          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
