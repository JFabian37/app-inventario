import { useState } from 'react';
import BotonesFila from '../components/BotonesFila.jsx';
import CategoriaForm from '../components/formularios/CategoriaForm.jsx';
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

export default function Categorias() {
  const { tienePermiso } = useAuth();
  const listado = useListado('/categorias', { filtrosIniciales: FILTROS });
  const [edicion, setEdicion] = useState(null);

  const eliminacion = useConfirmacion({
    accion: ({ id }) => api.delete(`/categorias/${id}`),
    alCompletar: listado.recargar,
  });

  const esAdministrador = tienePermiso(ADMINISTRADOR);

  const columnas = [
    {
      clave: 'nombre',
      titulo: 'Nombre',
      celda: (c) => (
        <span className={estilos.nombre}>
          {c.nombre}
          {!c.activo && <Badge>Inactiva</Badge>}
        </span>
      ),
    },
    { clave: 'descripcion', titulo: 'Descripción', celda: (c) => c.descripcion || '—' },
    {
      clave: 'productos',
      titulo: 'Productos',
      numerico: true,
      celda: (c) => c.cantidad_productos,
    },
    ...(esAdministrador
      ? [
          {
            clave: 'acciones',
            titulo: 'Acciones',
            celda: (c) => (
              <BotonesFila
                nombre={c.nombre}
                alEditar={() => setEdicion(c)}
                alEliminar={() => eliminacion.pedir(c)}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <EncabezadoPagina titulo="Categorías" descripcion="Organiza tus productos por familia">
        {esAdministrador && <Button onClick={() => setEdicion({})}>Nueva categoría</Button>}
      </EncabezadoPagina>

      <Herramientas>
        <Input
          label="Buscar"
          type="search"
          placeholder="Nombre o descripción"
          value={listado.busqueda}
          onChange={(evento) => listado.buscar(evento.target.value)}
        />
        <Casilla
          label="Incluir inactivas"
          checked={listado.filtros.incluir_inactivos === '1'}
          onChange={(evento) =>
            listado.filtrar('incluir_inactivos', evento.target.checked ? '1' : '')
          }
        />
      </Herramientas>

      <TablaListado
        listado={listado}
        etiqueta="Lista de categorías"
        columnas={columnas}
        icono="categorias"
        textoVacio="Todavía no hay categorías"
      />

      {edicion && (
        <CategoriaForm
          categoria={edicion}
          alCerrar={() => setEdicion(null)}
          alGuardar={() => {
            setEdicion(null);
            listado.recargar();
          }}
        />
      )}

      {eliminacion.objetivo && (
        <ConfirmDialog
          titulo="Eliminar categoría"
          mensaje={`¿Eliminar "${eliminacion.objetivo.nombre}"? No se podrá si tiene productos asociados.`}
          procesando={eliminacion.procesando}
          alConfirmar={eliminacion.confirmar}
          alCancelar={eliminacion.cancelar}
        />
      )}
    </>
  );
}
