import Skeleton from './Skeleton.jsx';
import estilos from './Table.module.css';

const FILAS_ESQUELETO = 5;

const claseCelda = ({ numerico, sinCorte }) =>
  [numerico && estilos.numerico, sinCorte && estilos.sinCorte].filter(Boolean).join(' ') || undefined;

// columnas: [{ clave, titulo, celda(fila), numerico, sinCorte }]. Bajo 768px cada fila es una tarjeta.
export default function Table({ etiqueta, columnas, filas, cargando = false, vacio }) {
  if (!cargando && filas.length === 0) return vacio;

  return (
    <div className={estilos.contenedor} aria-busy={cargando}>
      <table className={estilos.tabla}>
        <caption className="visualmente-oculto">{etiqueta}</caption>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave} scope="col" className={claseCelda(columna)}>
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cargando
            ? Array.from({ length: FILAS_ESQUELETO }, (_, fila) => (
                <tr key={fila}>
                  {columnas.map(({ clave, titulo }) => (
                    <td key={clave} data-label={titulo}>
                      <Skeleton />
                    </td>
                  ))}
                </tr>
              ))
            : filas.map((fila) => (
                <tr key={fila.id}>
                  {columnas.map((columna) => (
                    <td
                      key={columna.clave}
                      data-label={columna.titulo}
                      className={claseCelda(columna)}
                    >
                      {columna.celda(fila)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
