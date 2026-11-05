import Button from './Button.jsx';
import estilos from './Pagination.module.css';

export default function Pagination({ meta, alCambiar }) {
  if (!meta || meta.total === 0) return null;

  const { page, pages, limit, total } = meta;
  const desde = (page - 1) * limit + 1;
  const hasta = Math.min(page * limit, total);

  return (
    <nav className={estilos.paginacion} aria-label="Paginación">
      <p className={estilos.resumen}>
        {desde}–{hasta} de {total}
      </p>
      <div className={estilos.controles}>
        <Button variante="ghost" onClick={() => alCambiar(page - 1)} disabled={page <= 1}>
          Anterior
        </Button>
        <span className={estilos.pagina}>
          Página {page} de {pages}
        </span>
        <Button variante="ghost" onClick={() => alCambiar(page + 1)} disabled={page >= pages}>
          Siguiente
        </Button>
      </div>
    </nav>
  );
}
