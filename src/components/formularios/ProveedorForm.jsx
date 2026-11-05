import { useFormulario } from '../../hooks/useFormulario.js';
import { useToast } from '../../hooks/useToast.js';
import api from '../../services/api.js';
import Casilla from '../ui/Casilla.jsx';
import Input from '../ui/Input.jsx';
import FormularioModal from './FormularioModal.jsx';

const validar = ({ razon_social, ruc, email }) => {
  const errores = {};

  if (!razon_social.trim()) errores.razon_social = 'La razón social es obligatoria';
  if (ruc.trim() && !/^\d{11}$/.test(ruc.trim())) errores.ruc = 'El RUC debe tener 11 dígitos';
  if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) errores.email = 'El correo no es válido';

  return errores;
};

export default function ProveedorForm({ proveedor, alCerrar, alGuardar }) {
  const toast = useToast();
  const esNuevo = !proveedor?.id;

  const formulario = useFormulario({
    inicial: {
      razon_social: proveedor?.razon_social ?? '',
      ruc: proveedor?.ruc ?? '',
      contacto: proveedor?.contacto ?? '',
      telefono: proveedor?.telefono ?? '',
      email: proveedor?.email ?? '',
      activo: proveedor?.activo ?? true,
    },
    validar,
    enviar: (valores) =>
      esNuevo ? api.post('/proveedores', valores) : api.put(`/proveedores/${proveedor.id}`, valores),
    alCompletar: () => {
      toast.exito(esNuevo ? 'Proveedor creado' : 'Proveedor actualizado');
      alGuardar();
    },
  });

  const { campo, valores, alCambiar } = formulario;

  return (
    <FormularioModal
      titulo={esNuevo ? 'Nuevo proveedor' : 'Editar proveedor'}
      formulario={formulario}
      alCerrar={alCerrar}
    >
      <Input {...campo('razon_social')} label="Razón social *" className="completo" data-foco-inicial />
      <Input {...campo('ruc')} label="RUC" inputMode="numeric" maxLength={11} />
      <Input {...campo('contacto')} label="Contacto" />
      <Input {...campo('telefono')} label="Teléfono" type="tel" />
      <Input {...campo('email')} label="Correo" type="email" />
      {!esNuevo && (
        <Casilla
          name="activo"
          label="Proveedor activo"
          checked={valores.activo}
          onChange={alCambiar}
        />
      )}
    </FormularioModal>
  );
}
