import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const ProtectedRoute = ({ title }) => {
  const token = useAuthStore(state => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      <Sidebar />
      <div className="ml-64 pt-16 p-8">
        <TopBar title={title} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
