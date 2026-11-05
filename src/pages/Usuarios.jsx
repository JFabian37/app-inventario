import { useState } from 'react';
import BotonesFila from '../components/BotonesFila.jsx';
import UsuarioForm from '../components/formularios/UsuarioForm.jsx';
import TablaListado from '../components/TablaListado.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import EncabezadoPagina, { Herramientas } from '../components/ui/EncabezadoPagina.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import { useAuth } from '../context/auth.js';
import { useConfirmacion } from '../hooks/useConfirmacion.js';
import { useListado } from '../hooks/useListado.js';
import api from '../services/api.js';
import { ROLES } from '../utils/roles.js';

// Se piden tambien los inactivos: esta vista es el unico lugar donde reactivarlos
const FILTROS = { rol: '', incluir_inactivos: '1' };

export default function Usuarios() {
  const { usuario: sesion } = useAuth();
  const listado = useListado('/usuarios', { filtrosIniciales: FILTROS });
  const [edicion, setEdicion] = useState(null);

  const cambioEstado = useConfirmacion({
    accion: ({ id, activo }) => api.patch(`/usuarios/${id}/estado`, { activo: !activo }),
    alCompletar: listado.recargar,
    mensajeExito: 'Estado actualizado',
  });

  const columnas = [
    { clave: 'nombre', titulo: 'Nombre', celda: (u) => u.nombre },
    { clave: 'email', titulo: 'Correo', celda: (u) => u.email },
    { clave: 'rol', titulo: 'Rol', celda: (u) => <Badge tono="info">{u.rol}</Badge> },
    {
      clave: 'estado',
      titulo: 'Estado',
      celda: (u) =>
        u.activo ? <Badge tono="exito">Activo</Badge> : <Badge tono="peligro">Inactivo</Badge>,
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      celda: (u) => (
        <BotonesFila nombre={u.nombre} alEditar={() => setEdicion(u)}>
          {u.id !== sesion.id && (
            <Button
              pequeno
              variante={u.activo ? 'danger' : 'ghost'}
              onClick={() => cambioEstado.pedir(u)}
              aria-label={`${u.activo ? 'Desactivar' : 'Activar'} ${u.nombre}`}
            >
              {u.activo ? 'Desactivar' : 'Activar'}
            </Button>
          )}
        </BotonesFila>
      ),
    },
  ];

  const objetivo = cambioEstado.objetivo;

  return (
    <>
      <EncabezadoPagina titulo="Usuarios" descripcion="Cuentas y roles del sistema">
        <Button onClick={() => setEdicion({})}>Nuevo usuario</Button>
      </EncabezadoPagina>

      <Herramientas>
        <Input
          label="Buscar"
          type="search"
          placeholder="Nombre o correo"
          value={listado.busqueda}
          onChange={(evento) => listado.buscar(evento.target.value)}
        />
        <Select
          label="Rol"
          value={listado.filtros.rol}
          onChange={(evento) => listado.filtrar('rol', evento.target.value)}
        >
          <option value="">Todos</option>
          {ROLES.map((rol) => (
            <option key={rol} value={rol}>
              {rol}
            </option>
          ))}
        </Select>
      </Herramientas>

      <TablaListado
        listado={listado}
        etiqueta="Lista de usuarios"
        columnas={columnas}
        icono="usuarios"
        textoVacio="Todavía no hay usuarios"
      />

      {edicion && (
        <UsuarioForm
          usuario={edicion}
          esPropio={edicion.id === sesion.id}
          alCerrar={() => setEdicion(null)}
          alGuardar={() => {
            setEdicion(null);
            listado.recargar();
          }}
        />
      )}

      {objetivo && (
        <ConfirmDialog
          titulo={objetivo.activo ? 'Desactivar usuario' : 'Activar usuario'}
          mensaje={
            objetivo.activo
              ? `"${objetivo.nombre}" perderá el acceso de inmediato.`
              : `"${objetivo.nombre}" podrá volver a iniciar sesión.`
          }
          textoConfirmar={objetivo.activo ? 'Desactivar' : 'Activar'}
          variante={objetivo.activo ? 'danger' : 'primary'}
          procesando={cambioEstado.procesando}
          alConfirmar={cambioEstado.confirmar}
          alCancelar={cambioEstado.cancelar}
        />
      )}
    </>
  );
}
