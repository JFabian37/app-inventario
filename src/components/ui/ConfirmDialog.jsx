import Button from './Button.jsx';
import Modal from './Modal.jsx';
import estilos from './ConfirmDialog.module.css';

export default function ConfirmDialog({
  titulo,
  mensaje,
  textoConfirmar = 'Eliminar',
  variante = 'danger',
  procesando = false,
  alConfirmar,
  alCancelar,
}) {
  return (
    <Modal titulo={titulo} alCerrar={alCancelar} angosto>
      <p className={estilos.mensaje}>{mensaje}</p>
      <div className={estilos.acciones}>
        <Button variante="ghost" onClick={alCancelar} disabled={procesando} data-foco-inicial>
          Cancelar
        </Button>
        <Button variante={variante} onClick={alConfirmar} cargando={procesando}>
          {textoConfirmar}
        </Button>
      </div>
    </Modal>
  );
}
