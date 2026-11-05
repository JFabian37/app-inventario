import { useFormulario } from '../../hooks/useFormulario.js';
import { useToast } from '../../hooks/useToast.js';
import api from '../../services/api.js';
import Casilla from '../ui/Casilla.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import FormularioModal from './FormularioModal.jsx';

const validar = ({ nombre }) => (nombre.trim() ? {} : { nombre: 'El nombre es obligatorio' });

export default function CategoriaForm({ categoria, alCerrar, alGuardar }) {
  const toast = useToast();
  const esNuevo = !categoria?.id;

  const formulario = useFormulario({
    inicial: {
      nombre: categoria?.nombre ?? '',
      descripcion: categoria?.descripcion ?? '',
      activo: categoria?.activo ?? true,
    },
    validar,
    enviar: (valores) =>
      esNuevo ? api.post('/categorias', valores) : api.put(`/categorias/${categoria.id}`, valores),
    alCompletar: () => {
      toast.exito(esNuevo ? 'Categoría creada' : 'Categoría actualizada');
      alGuardar();
    },
  });

  const { campo, valores, alCambiar } = formulario;

  return (
    <FormularioModal
      titulo={esNuevo ? 'Nueva categoría' : 'Editar categoría'}
      formulario={formulario}
      alCerrar={alCerrar}
    >
      <Input {...campo('nombre')} label="Nombre *" className="completo" data-foco-inicial />
      <Textarea {...campo('descripcion')} label="Descripción" className="completo" />
      {!esNuevo && (
        <Casilla
          name="activo"
          label="Categoría activa"
          checked={valores.activo}
          onChange={alCambiar}
        />
      )}
    </FormularioModal>
  );
}
