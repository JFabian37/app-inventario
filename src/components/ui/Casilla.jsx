import estilos from './Casilla.module.css';

export default function Casilla({ label, ...resto }) {
  return (
    <label className={estilos.casilla}>
      <input type="checkbox" {...resto} />
      {label}
    </label>
  );
}
