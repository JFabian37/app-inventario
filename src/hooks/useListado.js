import { useMemo, useState } from 'react';
import { useConsulta } from './useConsulta.js';
import { useDebounce } from './useDebounce.js';

// Los filtros vacios no se envian a la API
const quitarVacios = (parametros) =>
  Object.fromEntries(Object.entries(parametros).filter(([, valor]) => valor !== ''));

// Listado paginado por el servidor con busqueda y filtros
export function useListado(ruta, { filtrosIniciales = {}, limite = 10 } = {}) {
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [page, setPage] = useState(1);

  const q = useDebounce(busqueda.trim());

  const parametros = useMemo(
    () => quitarVacios({ ...filtros, q, page, limit: limite }),
    [filtros, q, page, limite],
  );

  const { respuesta, error, cargando, actualizando, recargar } = useConsulta(ruta, parametros);
  const meta = respuesta?.meta ?? null;

  // Al borrar la ultima fila de la ultima pagina, esa pagina deja de existir
  if (meta && meta.pages > 0 && page > meta.pages && meta.page === page) {
    setPage(meta.pages);
  }

  const buscar = (texto) => {
    setBusqueda(texto);
    setPage(1);
  };

  const filtrar = (nombre, valor) => {
    setFiltros((actuales) => ({ ...actuales, [nombre]: valor }));
    setPage(1);
  };

  return {
    filas: respuesta?.data ?? [],
    meta,
    error,
    cargando,
    actualizando,
    busqueda,
    filtros,
    hayFiltros: Boolean(q) || Object.values(filtros).some(Boolean),
    buscar,
    filtrar,
    irAPagina: setPage,
    recargar,
  };
}
