import { useListado } from '../../hooks/useListado.js';
import { formatearNumero } from '../../utils/formato.js';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import estilos from './BuscadorProducto.module.css';

export default function BuscadorProducto({ producto, error, alElegir, alQuitar }) {
  const listado = useListado('/productos', { limite: 6 });

  if (producto) {
    return (
      <div className={`${estilos.elegido} completo`}>
        <div>
          <p className={estilos.nombre}>{producto.nombre}</p>
          <p className={estilos.dato}>{producto.codigo}</p>
        </div>
        <div className={estilos.stock}>
          <p className={estilos.dato}>Stock actual</p>
          <p className={estilos.cifra}>{formatearNumero(producto.stock)}</p>
        </div>
        <Button pequeno variante="ghost" onClick={alQuitar}>
          Cambiar
        </Button>
      </div>
    );
  }

  return (
    <div className="completo">
      <Input
        label="Producto *"
        type="search"
        placeholder="Busca por nombre o código"
        value={listado.busqueda}
        onChange={(evento) => listado.buscar(evento.target.value)}
        error={error}
        autoFocus
        data-foco-inicial
      />
      <ul className={estilos.resultados} aria-label="Productos encontrados">
        {listado.filas.map((fila) => (
          <li key={fila.id}>
            <button type="button" className={estilos.opcion} onClick={() => alElegir(fila)}>
              <span>
                {fila.nombre} <span className={estilos.dato}>{fila.codigo}</span>
              </span>
              <span className={estilos.dato}>Stock {formatearNumero(fila.stock)}</span>
            </button>
          </li>
        ))}
        {!listado.cargando && listado.filas.length === 0 && (
          <li className={estilos.sinResultados}>No se encontraron productos</li>
        )}
      </ul>
    </div>
  );
}
