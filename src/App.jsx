import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import PantallaEstado from './components/ui/PantallaEstado.jsx';
import Categorias from './pages/Categorias.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Kardex from './pages/Kardex.jsx';
import Login from './pages/Login.jsx';
import Productos from './pages/Productos.jsx';
import Proveedores from './pages/Proveedores.jsx';
import Usuarios from './pages/Usuarios.jsx';
import { ADMINISTRADOR } from './utils/roles.js';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<Productos />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="kardex" element={<Kardex />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute roles={[ADMINISTRADOR]}>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <PantallaEstado
              codigo="404"
              titulo="Página no encontrada"
              mensaje="La dirección que buscas no existe."
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
