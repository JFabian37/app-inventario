import estilos from './PantallaCarga.module.css';

export default function PantallaCarga() {
  return (
    <div className={estilos.pantalla} role="status">
      <span className={estilos.giro} aria-hidden="true" />
      <span className="visualmente-oculto">Cargando</span>
    </div>
  );
}
