import { useState } from 'react';
import BotonesFila from '../components/BotonesFila.jsx';
import ProveedorForm from '../components/formularios/ProveedorForm.jsx';
import TablaListado from '../components/TablaListado.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Casilla from '../components/ui/Casilla.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import EncabezadoPagina, { Herramientas } from '../components/ui/EncabezadoPagina.jsx';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../context/auth.js';
import { useConfirmacion } from '../hooks/useConfirmacion.js';
import { useListado } from '../hooks/useListado.js';
import api from '../services/api.js';
import { ADMINISTRADOR } from '../utils/roles.js';
import estilos from './Pagina.module.css';

const FILTROS = { incluir_inactivos: '' };

export default function Proveedores() {
  const { tienePermiso } = useAuth();
  const listado = useListado('/proveedores', { filtrosIniciales: FILTROS });
  const [edicion, setEdicion] = useState(null);

  const eliminacion = useConfirmacion({
    accion: ({ id }) => api.delete(`/proveedores/${id}`),
    alCompletar: listado.recargar,
  });

  const esAdministrador = tienePermiso(ADMINISTRADOR);

  const columnas = [
    {
      clave: 'razon_social',
      titulo: 'Razón social',
      celda: (p) => (
        <span className={estilos.nombre}>
          {p.razon_social}
          {!p.activo && <Badge>Inactivo</Badge>}
        </span>
      ),
    },
    { clave: 'ruc', titulo: 'RUC', celda: (p) => p.ruc ?? '—' },
    { clave: 'contacto', titulo: 'Contacto', celda: (p) => p.contacto ?? '—' },
    { clave: 'telefono', titulo: 'Teléfono', celda: (p) => p.telefono ?? '—' },
    { clave: 'email', titulo: 'Correo', celda: (p) => p.email ?? '—' },
    ...(esAdministrador
      ? [
          {
            clave: 'acciones',
            titulo: 'Acciones',
            celda: (p) => (
              <BotonesFila
                nombre={p.razon_social}
                alEditar={() => setEdicion(p)}
                alEliminar={() => eliminacion.pedir(p)}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <EncabezadoPagina titulo="Proveedores" descripcion="Empresas que abastecen tu almacén">
        {esAdministrador && <Button onClick={() => setEdicion({})}>Nuevo proveedor</Button>}
      </EncabezadoPagina>

      <Herramientas>
        <Input
          label="Buscar"
          type="search"
          placeholder="Razón social, RUC o contacto"
          value={listado.busqueda}
          onChange={(evento) => listado.buscar(evento.target.value)}
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
        etiqueta="Lista de proveedores"
        columnas={columnas}
        icono="proveedores"
        textoVacio="Todavía no hay proveedores"
      />

      {edicion && (
        <ProveedorForm
          proveedor={edicion}
          alCerrar={() => setEdicion(null)}
          alGuardar={() => {
            setEdicion(null);
            listado.recargar();
          }}
        />
      )}

      {eliminacion.objetivo && (
        <ConfirmDialog
          titulo="Eliminar proveedor"
          mensaje={`¿Eliminar "${eliminacion.objetivo.razon_social}"? Sus productos y movimientos quedarán sin proveedor.`}
          procesando={eliminacion.procesando}
          alConfirmar={eliminacion.confirmar}
          alCancelar={eliminacion.cancelar}
        />
      )}
    </>
  );
}
