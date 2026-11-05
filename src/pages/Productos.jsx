import { useState } from 'react';
import BotonesFila from '../components/BotonesFila.jsx';
import ProductoForm from '../components/formularios/ProductoForm.jsx';
import TablaListado from '../components/TablaListado.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Casilla from '../components/ui/Casilla.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import EncabezadoPagina, { Herramientas } from '../components/ui/EncabezadoPagina.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import { useAuth } from '../context/auth.js';
import { useConfirmacion } from '../hooks/useConfirmacion.js';
import { useConsulta } from '../hooks/useConsulta.js';
import { useListado } from '../hooks/useListado.js';
import api from '../services/api.js';
import { formatearMoneda } from '../utils/formato.js';
import { ADMINISTRADOR, ALMACENERO } from '../utils/roles.js';
import estilos from './Pagina.module.css';

const FILTROS = { categoria_id: '', bajo_stock: '', incluir_inactivos: '' };
const OPCIONES = { limit: 100 };

export default function Productos() {
  const { tienePermiso } = useAuth();
  const listado = useListado('/productos', { filtrosIniciales: FILTROS });
  const categorias = useConsulta('/categorias', OPCIONES).respuesta?.data ?? [];
  const proveedores = useConsulta('/proveedores', OPCIONES).respuesta?.data ?? [];
  const [edicion, setEdicion] = useState(null);

  const eliminacion = useConfirmacion({
    accion: ({ id }) => api.delete(`/productos/${id}`),
    alCompletar: listado.recargar,
  });

  const puedeGestionar = tienePermiso(ADMINISTRADOR, ALMACENERO);
  const puedeEliminar = tienePermiso(ADMINISTRADOR);

  const columnas = [
    { clave: 'codigo', titulo: 'Código', sinCorte: true, celda: (p) => p.codigo },
    {
      clave: 'nombre',
      titulo: 'Producto',
      celda: (p) => (
        <span className={estilos.nombre}>
          {p.nombre}
          {!p.activo && <Badge>Inactivo</Badge>}
        </span>
      ),
    },
    { clave: 'categoria', titulo: 'Categoría', celda: (p) => p.categoria.nombre },
    { clave: 'proveedor', titulo: 'Proveedor', celda: (p) => p.proveedor?.razon_social ?? '—' },
    { clave: 'precio', titulo: 'Precio', numerico: true, celda: (p) => formatearMoneda(p.precio) },
    {
      clave: 'stock',
      titulo: 'Stock',
      numerico: true,
      celda: (p) => (
        <span className={estilos.stock}>
          {p.stock <= p.stock_minimo && <Badge tono="alerta">Bajo</Badge>}
          {p.stock}
        </span>
      ),
    },
    ...(puedeGestionar
      ? [
          {
            clave: 'acciones',
            titulo: 'Acciones',
            celda: (p) => (
              <BotonesFila
                nombre={p.nombre}
                alEditar={() => setEdicion(p)}
                alEliminar={puedeEliminar ? () => eliminacion.pedir(p) : undefined}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <EncabezadoPagina titulo="Productos" descripcion="Catálogo y stock actual">
        {puedeGestionar && <Button onClick={() => setEdicion({})}>Nuevo producto</Button>}
      </EncabezadoPagina>

      <Herramientas>
        <Input
          label="Buscar"
          type="search"
          placeholder="Nombre o código"
          value={listado.busqueda}
          onChange={(evento) => listado.buscar(evento.target.value)}
        />
        <Select
          label="Categoría"
          value={listado.filtros.categoria_id}
          onChange={(evento) => listado.filtrar('categoria_id', evento.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map(({ id, nombre }) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </Select>
        <Casilla
          label="Solo bajo stock"
          checked={listado.filtros.bajo_stock === '1'}
          onChange={(evento) => listado.filtrar('bajo_stock', evento.target.checked ? '1' : '')}
        />
        <Casilla
          label="Incluir inactivos"
          checked={listado.filtros.incluir_inactivos === '1'}
          onChange={(evento) =>
            listado.filtrar('incluir_inactivos', evento.target.checked ? '1' : '')
          }
        />
      </Herramientas>

      <TablaListado
        listado={listado}
        etiqueta="Lista de productos"
        columnas={columnas}
        icono="productos"
        textoVacio="Todavía no hay productos"
      />

      {edicion && (
        <ProductoForm
          producto={edicion}
          categorias={categorias}
          proveedores={proveedores}
          alCerrar={() => setEdicion(null)}
          alGuardar={() => {
            setEdicion(null);
            listado.recargar();
          }}
        />
      )}

      {eliminacion.objetivo && (
        <ConfirmDialog
          titulo="Eliminar producto"
          mensaje={`¿Eliminar "${eliminacion.objetivo.nombre}"? Si tiene movimientos, quedará inactivo para conservar su historial.`}
          procesando={eliminacion.procesando}
          alConfirmar={eliminacion.confirmar}
          alCancelar={eliminacion.cancelar}
        />
      )}
    </>
  );
}
