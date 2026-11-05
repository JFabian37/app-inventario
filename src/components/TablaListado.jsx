import Button from './ui/Button.jsx';
import Card from './ui/Card.jsx';
import EmptyState from './ui/EmptyState.jsx';
import Pagination from './ui/Pagination.jsx';
import Table from './ui/Table.jsx';
import estilos from './TablaListado.module.css';

// Une tabla, paginacion y los estados de carga, vacio y error de un useListado
export default function TablaListado({ listado, etiqueta, columnas, icono, textoVacio }) {
  if (listado.error && listado.filas.length === 0) {
    return (
      <Card>
        <EmptyState icono={icono} titulo="No se pudo cargar la información" mensaje={listado.error}>
          <Button variante="ghost" onClick={listado.recargar}>
            Reintentar
          </Button>
        </EmptyState>
      </Card>
    );
  }

  const vacio = listado.hayFiltros ? (
    <EmptyState
      icono={icono}
      titulo="Sin resultados"
      mensaje="Prueba con otra búsqueda o cambia los filtros."
    />
  ) : (
    <EmptyState icono={icono} titulo={textoVacio} />
  );

  return (
    <Card sinRelleno className={listado.actualizando ? estilos.actualizando : undefined}>
      <Table
        etiqueta={etiqueta}
        columnas={columnas}
        filas={listado.filas}
        cargando={listado.cargando}
        vacio={vacio}
      />
      <Pagination meta={listado.meta} alCambiar={listado.irAPagina} />
    </Card>
  );
}
