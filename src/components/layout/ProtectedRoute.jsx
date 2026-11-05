import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth.js';
import PantallaEstado from '../ui/PantallaEstado.jsx';
import PantallaCarga from './PantallaCarga.jsx';

export default function ProtectedRoute({ roles = [], children }) {
  const { usuario, cargando, tienePermiso } = useAuth();
  const { pathname } = useLocation();

  if (cargando) return <PantallaCarga />;

  if (!usuario) return <Navigate to="/login" replace state={{ desde: pathname }} />;

  if (!tienePermiso(...roles)) {
    return (
      <PantallaEstado
        codigo="403"
        titulo="Sin permisos"
        mensaje={`Tu rol (${usuario.rol}) no tiene acceso a esta sección.`}
      />
    );
  }

  return children ?? <Outlet />;
}
