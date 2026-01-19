import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { LotCodeAccessPage } from '../pages/LotCodeAccessPage';
import { OperarioDashboard } from '../pages/OperarioDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { isLotAuthenticated, isAdminAuthenticated } from '../services/AuthService';

const ProtectedLotRoute = () => {
  return isLotAuthenticated() ? <OperarioDashboard /> : <Navigate to="/lote/acceso" replace />;
};

const ProtectedAdminRoute = () => {
  return isAdminAuthenticated() ? <AdminDashboard /> : <Navigate to="/admin/login" replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute />} />
        <Route path="/lote/acceso" element={<LotCodeAccessPage />} />
        <Route path="/lote/dashboard" element={<ProtectedLotRoute />} />
      </Routes>
    </BrowserRouter>
  );
};
