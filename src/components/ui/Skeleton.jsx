import estilos from './Skeleton.module.css';

export default function Skeleton({ ancho = '100%', alto = 16 }) {
  return <span className={estilos.skeleton} style={{ width: ancho, height: alto }} aria-hidden="true" />;
}
