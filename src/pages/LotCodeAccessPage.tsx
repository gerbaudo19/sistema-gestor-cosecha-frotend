import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../components/FormInput';
import { lotLogin, saveLotToken } from '../services/AuthService';

export const LotCodeAccessPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await lotLogin({ code });
      saveLotToken(response.lotToken, response.lotId);
      navigate('/lote/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al acceder al lote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Ingreso por código de lote</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <FormInput
            label="Código de lote"
            type="text"
            value={code}
            onChange={setCode}
            placeholder="Ingrese el código del lote"
            disabled={loading}
          />

          {error && <div className="form-error-box">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="form-submit-button"
          >
            {loading ? 'Accediendo...' : 'Acceder'}
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
