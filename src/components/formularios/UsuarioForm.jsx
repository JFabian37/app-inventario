import { useFormulario } from '../../hooks/useFormulario.js';
import { useToast } from '../../hooks/useToast.js';
import api from '../../services/api.js';
import { ALMACENERO, ROLES } from '../../utils/roles.js';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import FormularioModal from './FormularioModal.jsx';

const validar = ({ nombre, email, password }, esNuevo) => {
  const errores = {};

  if (!nombre.trim()) errores.nombre = 'El nombre es obligatorio';

  if (!email.trim()) errores.email = 'El correo es obligatorio';
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errores.email = 'El correo no es válido';

  if (esNuevo && !password) errores.password = 'La contraseña es obligatoria';
  else if (password && password.length < 8) errores.password = 'Debe tener al menos 8 caracteres';

  return errores;
};

export default function UsuarioForm({ usuario, esPropio, alCerrar, alGuardar }) {
  const toast = useToast();
  const esNuevo = !usuario?.id;

  const formulario = useFormulario({
    inicial: {
      nombre: usuario?.nombre ?? '',
      email: usuario?.email ?? '',
      password: '',
      rol: usuario?.rol ?? ALMACENERO,
    },
    validar: (valores) => validar(valores, esNuevo),
    enviar: (valores) =>
      esNuevo ? api.post('/auth/register', valores) : api.put(`/usuarios/${usuario.id}`, valores),
    alCompletar: () => {
      toast.exito(esNuevo ? 'Usuario creado' : 'Usuario actualizado');
      alGuardar();
    },
  });

  const { campo } = formulario;

  return (
    <FormularioModal
      titulo={esNuevo ? 'Nuevo usuario' : 'Editar usuario'}
      formulario={formulario}
      alCerrar={alCerrar}
    >
      <Input {...campo('nombre')} label="Nombre *" className="completo" data-foco-inicial />
      <Input {...campo('email')} label="Correo *" type="email" className="completo" />
      <Input
        {...campo('password')}
        label={esNuevo ? 'Contraseña *' : 'Nueva contraseña'}
        type="password"
        autoComplete="new-password"
        ayuda={esNuevo ? 'Mínimo 8 caracteres.' : 'Déjala vacía para no cambiarla.'}
      />
      <Select
        {...campo('rol')}
        label="Rol *"
        disabled={esPropio}
        ayuda={esPropio ? 'No puedes cambiar tu propio rol.' : undefined}
      >
        {ROLES.map((rol) => (
          <option key={rol} value={rol}>
            {rol}
          </option>
        ))}
      </Select>
    </FormularioModal>
  );
}
