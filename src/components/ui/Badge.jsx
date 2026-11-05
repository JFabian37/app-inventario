import estilos from './Badge.module.css';

export default function Badge({ tono = 'neutro', children }) {
  return <span className={`${estilos.badge} ${estilos[tono]}`}>{children}</span>;
}

const TONOS_MOVIMIENTO = { Entrada: 'exito', Salida: 'peligro', Ajuste: 'alerta' };

export function BadgeMovimiento({ tipo }) {
  return <Badge tono={TONOS_MOVIMIENTO[tipo]}>{tipo}</Badge>;
}
