import { useEffect, useId, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import estilos from './AppLayout.module.css';

const CLAVE_COLAPSADO = 'inventario_sidebar_colapsado';
const CONSULTA_MOVIL = '(max-width: 767.98px)';

const leerColapsado = () => {
  try {
    return localStorage.getItem(CLAVE_COLAPSADO) === '1';
  } catch {
    return false;
  }
};

const guardarColapsado = (valor) => {
  try {
    localStorage.setItem(CLAVE_COLAPSADO, valor ? '1' : '0');
  } catch {
    // Sin almacenamiento el menu funciona igual: solo no se recuerda la preferencia
  }
};

export default function AppLayout() {
  const idMenu = useId();
  const botonMenuRef = useRef(null);
  const [colapsado, setColapsado] = useState(leerColapsado);
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  const cerrarDrawer = () => setDrawerAbierto(false);

  const alternarMenu = () => {
    if (window.matchMedia(CONSULTA_MOVIL).matches) {
      setDrawerAbierto((abierto) => !abierto);
      return;
    }

    const siguiente = !colapsado;
    guardarColapsado(siguiente);
    setColapsado(siguiente);
  };

  useEffect(() => {
    if (!drawerAbierto) return undefined;

    const alPresionarTecla = (evento) => {
      if (evento.key === 'Escape') {
        setDrawerAbierto(false);
        botonMenuRef.current?.focus();
      }
    };

    window.addEventListener('keydown', alPresionarTecla);
    return () => window.removeEventListener('keydown', alPresionarTecla);
  }, [drawerAbierto]);

  return (
    <div className={colapsado ? `${estilos.app} ${estilos.colapsado}` : estilos.app}>
      <a className={estilos.saltar} href="#contenido">
        Saltar al contenido
      </a>

      <Sidebar id={idMenu} colapsado={colapsado} abierto={drawerAbierto} alCerrar={cerrarDrawer} />

      {drawerAbierto && (
        <div className={estilos.velo} onClick={cerrarDrawer} aria-hidden="true" />
      )}

      <div className={estilos.principal}>
        <Topbar
          idMenu={idMenu}
          botonMenuRef={botonMenuRef}
          menuExpandido={drawerAbierto || !colapsado}
          alAlternarMenu={alternarMenu}
        />
        <main id="contenido" className={estilos.contenido} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
