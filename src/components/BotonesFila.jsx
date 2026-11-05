import Button from './ui/Button.jsx';
import estilos from './BotonesFila.module.css';

// Acciones de una fila. nombre completa el aria-label: un lector de pantalla no debe
// escuchar diez botones "Editar" iguales.
export default function BotonesFila({ nombre, alEditar, alEliminar, textoEliminar = 'Eliminar', children }) {
  return (
    <div className={estilos.botones}>
      {alEditar && (
        <Button pequeno variante="ghost" onClick={alEditar} aria-label={`Editar ${nombre}`}>
          Editar
        </Button>
      )}
      {children}
      {alEliminar && (
        <Button
          pequeno
          variante="danger"
          onClick={alEliminar}
          aria-label={`${textoEliminar} ${nombre}`}
        >
          {textoEliminar}
        </Button>
      )}
    </div>
  );
}
