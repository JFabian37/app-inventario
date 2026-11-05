import { useState } from 'react';
import { formatearNumero } from '../utils/formato.js';
import estilos from './DonutChart.module.css';

const RADIO = 70;
const GROSOR = 22;
const LADO = 2 * (RADIO + GROSOR);
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;
const SEPARACION = 2; // Espacio entre segmentos: distingue colores vecinos con daltonismo
const SERIES_MAXIMAS = 8;

// Con mas series que colores, las menores se agrupan: nunca se inventa un color nuevo
const agrupar = (datos) => {
  if (datos.length <= SERIES_MAXIMAS) return datos;

  const ordenados = [...datos].sort((a, b) => b.stock - a.stock);
  const principales = ordenados.slice(0, SERIES_MAXIMAS - 1);
  const resto = ordenados.slice(SERIES_MAXIMAS - 1);

  return [
    ...principales,
    { id: 'otras', nombre: 'Otras', stock: resto.reduce((suma, { stock }) => suma + stock, 0) },
  ];
};

// El color sigue a la categoria (por id), no a su posicion: si cambia el stock
// y se reordena la lista, ninguna categoria cambia de color.
const asignarColores = (series) => {
  const porId = series.filter(({ id }) => id !== 'otras').sort((a, b) => a.id - b.id);
  const colores = new Map(porId.map(({ id }, indice) => [id, `var(--serie-${indice + 1})`]));
  colores.set('otras', 'var(--serie-otras)');
  return colores;
};

const construirSegmentos = (series, total, colores) => {
  let acumulado = 0;

  return series
    .filter(({ stock }) => stock > 0)
    .map((serie) => {
      const largo = (serie.stock / total) * CIRCUNFERENCIA;
      const segmento = {
        ...serie,
        color: colores.get(serie.id),
        arco: Math.max(largo - SEPARACION, 1),
        desplazamiento: -acumulado,
      };
      acumulado += largo;
      return segmento;
    });
};

export default function DonutChart({ datos }) {
  const [activoId, setActivoId] = useState(null);

  const series = agrupar(datos);
  const colores = asignarColores(series);
  const total = series.reduce((suma, { stock }) => suma + stock, 0);
  const segmentos = construirSegmentos(series, total, colores);
  const activo = series.find(({ id }) => id === activoId);
  const porcentaje = (stock) => `${Math.round((stock / total) * 100)}%`;

  const resumen = series.map((s) => `${s.nombre}: ${s.stock}`).join(', ');

  return (
    <div className={estilos.grafico}>
      <div className={estilos.lienzo}>
        <svg
          viewBox={`0 0 ${LADO} ${LADO}`}
          role="img"
          aria-label={`Stock por categoría. Total ${total}. ${resumen}`}
        >
          <g transform={`rotate(-90 ${LADO / 2} ${LADO / 2})`} fill="none">
            {segmentos.map(({ id, color, arco, desplazamiento }) => (
              <circle
                key={id}
                cx={LADO / 2}
                cy={LADO / 2}
                r={RADIO}
                stroke={color}
                strokeWidth={activoId === id ? GROSOR + 4 : GROSOR}
                strokeDasharray={`${arco} ${CIRCUNFERENCIA - arco}`}
                strokeDashoffset={desplazamiento}
                className={estilos.segmento}
                onMouseEnter={() => setActivoId(id)}
                onMouseLeave={() => setActivoId(null)}
              />
            ))}
          </g>
        </svg>

        <div className={estilos.centro} aria-hidden="true">
          <span className={estilos.valor}>{formatearNumero(activo?.stock ?? total)}</span>
          <span className={estilos.etiqueta}>{activo?.nombre ?? 'unidades'}</span>
        </div>
      </div>

      {/* La leyenda da las cifras exactas: el dato nunca depende solo del color */}
      <ul className={estilos.leyenda}>
        {series.map(({ id, nombre, stock }) => (
          <li
            key={id}
            className={activoId === id ? estilos.resaltado : undefined}
            onMouseEnter={() => setActivoId(id)}
            onMouseLeave={() => setActivoId(null)}
          >
            <span className={estilos.muestra} style={{ background: colores.get(id) }} />
            <span className={estilos.nombre}>{nombre}</span>
            <span className={estilos.cifra}>{formatearNumero(stock)}</span>
            <span className={estilos.parte}>{porcentaje(stock)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
