import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { LotCodeAccessPage } from '../pages/LotCodeAccessPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/lote/acceso" element={<LotCodeAccessPage />} />
      </Routes>
    </BrowserRouter>
  );
};
