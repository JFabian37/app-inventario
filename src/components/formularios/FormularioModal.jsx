import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';
import estilos from './FormularioModal.module.css';

// Estructura comun de los formularios: titulo, error general, campos y botones
export default function FormularioModal({ titulo, formulario, alCerrar, children }) {
  const { alEnviar, errorGeneral, enviando } = formulario;

  return (
    <Modal titulo={titulo} alCerrar={alCerrar}>
      <form className={estilos.formulario} onSubmit={alEnviar} noValidate>
        <div className={estilos.campos}>
          {errorGeneral && (
            <p className={estilos.alerta} role="alert">
              {errorGeneral}
            </p>
          )}
          {children}
        </div>
        <div className={estilos.acciones}>
          <Button variante="ghost" onClick={alCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" cargando={enviando}>
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
