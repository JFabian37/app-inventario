import { useState } from 'react';
import { useConsulta } from '../../hooks/useConsulta.js';
import { useFormulario } from '../../hooks/useFormulario.js';
import { useToast } from '../../hooks/useToast.js';
import api from '../../services/api.js';
import { formatearNumero } from '../../utils/formato.js';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Textarea from '../ui/Textarea.jsx';
import BuscadorProducto from './BuscadorProducto.jsx';
import FormularioModal from './FormularioModal.jsx';
import estilos from './MovimientoForm.module.css';

const PROVEEDORES_ACTIVOS = { limit: 100 };

const validar = ({ tipo_movimiento, cantidad }, producto) => {
  const errores = {};

  if (!producto) errores.producto_id = 'Selecciona un producto';

  const numero = Number(cantidad);
  const minimo = tipo_movimiento === 'Ajuste' ? 0 : 1;

  if (cantidad === '' || !Number.isInteger(numero) || numero < minimo) {
    errores.cantidad = `Ingresa un entero mayor o igual a ${minimo}`;
  } else if (tipo_movimiento === 'Salida' && producto && numero > producto.stock) {
    errores.cantidad = `No puede superar el stock disponible (${producto.stock})`;
  }

  return errores;
};

const calcularStock = (tipo, stock, cantidad) => {
  if (tipo === 'Entrada') return stock + cantidad;
  if (tipo === 'Salida') return stock - cantidad;
  return cantidad;
};

export default function MovimientoForm({ alCerrar, alGuardar }) {
  const toast = useToast();
  const [producto, setProducto] = useState(null);
  const proveedores = useConsulta('/proveedores', PROVEEDORES_ACTIVOS);

  const formulario = useFormulario({
    inicial: { tipo_movimiento: 'Entrada', cantidad: '', proveedor_id: '', observaciones: '' },
    validar: (valores) => validar(valores, producto),
    enviar: ({ tipo_movimiento, cantidad, proveedor_id, observaciones }) =>
      api.post('/movimientos', {
        producto_id: producto.id,
        tipo_movimiento,
        cantidad,
        // Solo una entrada viene de un proveedor
        proveedor_id: tipo_movimiento === 'Entrada' ? proveedor_id : '',
        observaciones,
      }),
    alCompletar: () => {
      toast.exito('Movimiento registrado');
      alGuardar();
    },
  });

  const { campo, valores, errores } = formulario;
  const { tipo_movimiento, cantidad } = valores;
  const esAjuste = tipo_movimiento === 'Ajuste';

  const stockResultante =
    producto && cantidad !== '' && Number.isInteger(Number(cantidad))
      ? calcularStock(tipo_movimiento, producto.stock, Number(cantidad))
      : null;

  return (
    <FormularioModal titulo="Registrar movimiento" formulario={formulario} alCerrar={alCerrar}>
      <BuscadorProducto
        producto={producto}
        error={errores.producto_id}
        alElegir={setProducto}
        alQuitar={() => setProducto(null)}
      />
      <Select {...campo('tipo_movimiento')} label="Tipo *">
        <option value="Entrada">Entrada</option>
        <option value="Salida">Salida</option>
        <option value="Ajuste">Ajuste</option>
      </Select>
      <Input
        {...campo('cantidad')}
        label={esAjuste ? 'Stock final *' : 'Cantidad *'}
        type="number"
        min={esAjuste ? 0 : 1}
        step="1"
        max={tipo_movimiento === 'Salida' ? producto?.stock : undefined}
        ayuda={esAjuste ? 'El stock pasará a este valor.' : undefined}
      />
      {tipo_movimiento === 'Entrada' && (
        <Select {...campo('proveedor_id')} label="Proveedor" className="completo">
          <option value="">Sin proveedor</option>
          {(proveedores.respuesta?.data ?? []).map(({ id, razon_social }) => (
            <option key={id} value={id}>
              {razon_social}
            </option>
          ))}
        </Select>
      )}
      <Textarea {...campo('observaciones')} label="Observaciones" className="completo" />
      {stockResultante !== null && (
        <p className={`${estilos.resultado} completo`}>
          Stock después del movimiento:{' '}
          <strong className={stockResultante < 0 ? estilos.negativo : undefined}>
            {formatearNumero(stockResultante)}
          </strong>
        </p>
      )}
    </FormularioModal>
  );
}
