import estilos from './Button.module.css';

export default function Button({
  variante = 'primary',
  cargando = false,
  disabled = false,
  pequeno = false,
  type = 'button',
  className = '',
  children,
  ...resto
}) {
  return (
    <button
      type={type}
      className={`${estilos.boton} ${estilos[variante]} ${pequeno ? estilos.pequeno : ''} ${className}`}
      disabled={disabled || cargando}
      aria-busy={cargando}
      {...resto}
    >
      {cargando && <span className={estilos.giro} aria-hidden="true" />}
      {children}
    </button>
  );
}
