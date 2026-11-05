import estilos from './Card.module.css';

export default function Card({ titulo, sinRelleno = false, className = '', children }) {
  return (
    <section className={`${estilos.card} ${sinRelleno ? estilos.sinRelleno : ''} ${className}`}>
      {titulo && <h2 className={estilos.titulo}>{titulo}</h2>}
      {children}
    </section>
  );
}
