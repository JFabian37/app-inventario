import { useState } from 'react';
import BotonesFila from '../components/BotonesFila.jsx';
import MovimientoForm from '../components/formularios/MovimientoForm.jsx';
import TablaListado from '../components/TablaListado.jsx';
import Badge, { BadgeMovimiento } from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import EncabezadoPagina, { Herramientas } from '../components/ui/EncabezadoPagina.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import { useAuth } from '../context/auth.js';
import { useConfirmacion } from '../hooks/useConfirmacion.js';
import { useListado } from '../hooks/useListado.js';
import api from '../services/api.js';
import { formatearFecha } from '../utils/formato.js';
import { ADMINISTRADOR, ALMACENERO } from '../utils/roles.js';
import estilos from './Pagina.module.css';

const FILTROS = { tipo: '', desde: '', hasta: '' };

export default function Kardex() {
  const { tienePermiso } = useAuth();
  const listado = useListado('/movimientos', { filtrosIniciales: FILTROS });
  const [registrando, setRegistrando] = useState(false);

  const anulacion = useConfirmacion({
    accion: ({ id }) => api.patch(`/movimientos/${id}/anular`),
    alCompletar: listado.recargar,
    mensajeExito: 'Movimiento anulado',
  });

  const esAdministrador = tienePermiso(ADMINISTRADOR);

  const columnas = [
    { clave: 'fecha', titulo: 'Fecha', sinCorte: true, celda: (m) => formatearFecha(m.fecha_hora) },
    {
      clave: 'producto',
      titulo: 'Producto',
      celda: (m) => (
        <span>
          {m.producto.nombre}
          <span className={estilos.secundario}>{m.producto.codigo}</span>
        </span>
      ),
    },
    {
      clave: 'tipo',
      titulo: 'Tipo',
      celda: (m) => (
        <span className={estilos.nombre}>
          <BadgeMovimiento tipo={m.tipo_movimiento} />
          {m.anulado && <Badge>Anulado</Badge>}
        </span>
      ),
    },
    { clave: 'cantidad', titulo: 'Cantidad', numerico: true, celda: (m) => m.cantidad },
    {
      clave: 'stock',
      titulo: 'Stock',
      numerico: true,
      celda: (m) => (
        <span className={m.anulado ? estilos.anulado : undefined}>
          {m.stock_anterior} → {m.stock_nuevo}
        </span>
      ),
    },
    { clave: 'usuario', titulo: 'Usuario', celda: (m) => m.usuario.nombre },
    {
      clave: 'observaciones',
      titulo: 'Observaciones',
      celda: (m) => (
        <span className={estilos.limitado} title={m.observaciones ?? undefined}>
          {m.observaciones || '—'}
        </span>
      ),
    },
    ...(esAdministrador
      ? [
          {
            clave: 'acciones',
            titulo: 'Acciones',
            celda: (m) =>
              m.anulado ? (
                '—'
              ) : (
                <BotonesFila
                  nombre={`movimiento de ${m.producto.nombre}`}
                  textoEliminar="Anular"
                  alEliminar={() => anulacion.pedir(m)}
                />
              ),
          },
        ]
      : []),
  ];

  return (
    <>
      <EncabezadoPagina titulo="Kardex" descripcion="Historial de entradas, salidas y ajustes">
        {tienePermiso(ADMINISTRADOR, ALMACENERO) && (
          <Button onClick={() => setRegistrando(true)}>Registrar movimiento</Button>
        )}
      </EncabezadoPagina>

      <Herramientas>
        <Input
          label="Buscar producto"
          type="search"
          placeholder="Nombre o código"
          value={listado.busqueda}
          onChange={(evento) => listado.buscar(evento.target.value)}
        />
        <Select
          label="Tipo"
          value={listado.filtros.tipo}
          onChange={(evento) => listado.filtrar('tipo', evento.target.value)}
        >
          <option value="">Todos</option>
          <option value="Entrada">Entrada</option>
          <option value="Salida">Salida</option>
          <option value="Ajuste">Ajuste</option>
        </Select>
        <Input
          label="Desde"
          type="date"
          value={listado.filtros.desde}
          max={listado.filtros.hasta || undefined}
          onChange={(evento) => listado.filtrar('desde', evento.target.value)}
        />
        <Input
          label="Hasta"
          type="date"
          value={listado.filtros.hasta}
          min={listado.filtros.desde || undefined}
          onChange={(evento) => listado.filtrar('hasta', evento.target.value)}
        />
      </Herramientas>

      <TablaListado
        listado={listado}
        etiqueta="Movimientos del kardex"
        columnas={columnas}
        icono="kardex"
        textoVacio="Todavía no hay movimientos"
      />

      {registrando && (
        <MovimientoForm
          alCerrar={() => setRegistrando(false)}
          alGuardar={() => {
            setRegistrando(false);
            listado.recargar();
          }}
        />
      )}

      {anulacion.objetivo && (
        <ConfirmDialog
          titulo="Anular movimiento"
          mensaje={`¿Anular esta ${anulacion.objetivo.tipo_movimiento.toLowerCase()} de "${anulacion.objetivo.producto.nombre}"? Se revertirá su efecto en el stock.`}
          textoConfirmar="Anular"
          procesando={anulacion.procesando}
          alConfirmar={anulacion.confirmar}
          alCancelar={anulacion.cancelar}
        />
      )}
    </>
  );
}
