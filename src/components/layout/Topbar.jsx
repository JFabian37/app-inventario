import { useAuth } from '../../context/auth.js';
import Button from '../ui/Button.jsx';
import Icono from '../ui/Icono.jsx';
import estilos from './Topbar.module.css';

const obtenerIniciales = (nombre = '') =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join('');

export default function Topbar({ idMenu, botonMenuRef, menuExpandido, alAlternarMenu }) {
  const { usuario, logout } = useAuth();

  return (
    <header className={estilos.topbar}>
      <button
        ref={botonMenuRef}
        type="button"
        className={estilos.botonMenu}
        onClick={alAlternarMenu}
        aria-label="Alternar menú"
        aria-controls={idMenu}
        aria-expanded={menuExpandido}
      >
        <Icono nombre="menu" />
      </button>

      <div className={estilos.usuario}>
        <span className={estilos.avatar} aria-hidden="true">
          {obtenerIniciales(usuario.nombre)}
        </span>
        <span className={estilos.datos}>
          <span className={estilos.nombre}>{usuario.nombre}</span>
          <span className={estilos.rol}>{usuario.rol}</span>
        </span>
      </div>

      <Button variante="ghost" className={estilos.salir} onClick={logout}>
        <Icono nombre="salir" tamano={18} />
        <span className={estilos.textoSalir}>Cerrar sesión</span>
      </Button>
    </header>
  );
}
