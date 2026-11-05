import { Link } from 'react-router-dom';
import estilos from './PantallaEstado.module.css';

// Pantalla completa para 403 y 404
export default function PantallaEstado({ codigo, titulo, mensaje }) {
  return (
    <section className={estilos.pantalla}>
      <p className={estilos.codigo}>{codigo}</p>
      <h1 className={estilos.titulo}>{titulo}</h1>
      <p className={estilos.mensaje}>{mensaje}</p>
      <Link className={estilos.enlace} to="/">
        Volver al inicio
      </Link>
    </section>
  );
}
