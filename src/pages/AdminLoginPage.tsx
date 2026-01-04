import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../components/FormInput';
import { adminLogin, saveAdminToken } from '../services/AuthService';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin({ email, password });
      saveAdminToken(response.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Ingreso Administrador</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="usuario@example.com"
            disabled={loading}
          />

          <FormInput
            label="Contraseña"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Ingrese su contraseña"
            disabled={loading}
          />

          {error && <div className="form-error-box">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="form-submit-button"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="form-back-button"
            disabled={loading}
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
};
