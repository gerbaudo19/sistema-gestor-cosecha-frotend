import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/PrimaryButton';
import { Logo } from '../components/Logo';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="card">
        <Logo />

        <div className="content-section">
          <p>Seleccione cómo desea ingresar</p>

          <div className="button-group">
            <PrimaryButton
              text="Ingresar como Administrador"
              variant="admin"
              onClick={() => navigate('/admin/login')}
            />

            <PrimaryButton
              text="Ingresar con código de lote"
              variant="lote"
              onClick={() => navigate('/lote/acceso')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
