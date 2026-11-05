import { useFormulario } from '../../hooks/useFormulario.js';
import { useToast } from '../../hooks/useToast.js';
import api from '../../services/api.js';
import Casilla from '../ui/Casilla.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Textarea from '../ui/Textarea.jsx';
import FormularioModal from './FormularioModal.jsx';

const esEnteroNoNegativo = (valor) => Number.isInteger(Number(valor)) && Number(valor) >= 0;

const validar = (valores, esNuevo) => {
  const errores = {};

  if (!valores.nombre.trim()) errores.nombre = 'El nombre es obligatorio';
  if (!valores.categoria_id) errores.categoria_id = 'Selecciona una categoría';

  if (valores.precio === '') errores.precio = 'El precio es obligatorio';
  else if (Number(valores.precio) < 0) errores.precio = 'El precio no puede ser negativo';

  if (valores.stock_minimo === '' || !esEnteroNoNegativo(valores.stock_minimo)) {
    errores.stock_minimo = 'Debe ser un entero mayor o igual a 0';
  }

  if (esNuevo && !esEnteroNoNegativo(valores.stock)) {
    errores.stock = 'Debe ser un entero mayor o igual a 0';
  }

  return errores;
};

// Una categoria desactivada ya no viene en la lista, pero el producto aun la usa
const incluirActual = (opciones, actual) =>
  actual && !opciones.some(({ id }) => id === actual.id) ? [actual, ...opciones] : opciones;

export default function ProductoForm({ producto, categorias, proveedores, alCerrar, alGuardar }) {
  const toast = useToast();
  const esNuevo = !producto?.id;

  const formulario = useFormulario({
    inicial: {
      nombre: producto?.nombre ?? '',
      codigo: producto?.codigo ?? '',
      descripcion: producto?.descripcion ?? '',
      precio: producto?.precio ?? '',
      stock: '',
      stock_minimo: producto?.stock_minimo ?? 5,
      categoria_id: producto?.categoria_id ?? '',
      proveedor_id: producto?.proveedor_id ?? '',
      activo: producto?.activo ?? true,
    },
    validar: (valores) => validar(valores, esNuevo),
    enviar: (valores) =>
      esNuevo ? api.post('/productos', valores) : api.put(`/productos/${producto.id}`, valores),
    alCompletar: () => {
      toast.exito(esNuevo ? 'Producto creado' : 'Producto actualizado');
      alGuardar();
    },
  });

  const { campo, valores, alCambiar } = formulario;

  return (
    <FormularioModal
      titulo={esNuevo ? 'Nuevo producto' : 'Editar producto'}
      formulario={formulario}
      alCerrar={alCerrar}
    >
      <Input {...campo('nombre')} label="Nombre *" className="completo" data-foco-inicial />
      <Select {...campo('categoria_id')} label="Categoría *">
        <option value="">Selecciona una categoría</option>
        {incluirActual(categorias, producto?.categoria).map(({ id, nombre }) => (
          <option key={id} value={id}>
            {nombre}
          </option>
        ))}
      </Select>
      <Select {...campo('proveedor_id')} label="Proveedor">
        <option value="">Sin proveedor</option>
        {incluirActual(proveedores, producto?.proveedor).map(({ id, razon_social }) => (
          <option key={id} value={id}>
            {razon_social}
          </option>
        ))}
      </Select>
      <Input {...campo('precio')} label="Precio (S/) *" type="number" min="0" step="0.01" />
      <Input
        {...campo('codigo')}
        label="Código"
        ayuda={esNuevo ? 'Si lo dejas vacío, se genera solo.' : undefined}
      />
      {esNuevo ? (
        <Input
          {...campo('stock')}
          label="Stock inicial"
          type="number"
          min="0"
          step="1"
          ayuda="Se registra como entrada en el kardex."
        />
      ) : (
        <Input
          label="Stock actual"
          value={producto.stock}
          disabled
          ayuda="Se modifica desde el Kardex."
        />
      )}
      <Input {...campo('stock_minimo')} label="Stock mínimo *" type="number" min="0" step="1" />
      <Textarea {...campo('descripcion')} label="Descripción" className="completo" />
      {!esNuevo && (
        <Casilla
          name="activo"
          label="Producto activo"
          checked={valores.activo}
          onChange={alCambiar}
        />
      )}
    </FormularioModal>
  );
}
