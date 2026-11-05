import DonutChart from '../components/DonutChart.jsx';
import Badge, { BadgeMovimiento } from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import EncabezadoPagina from '../components/ui/EncabezadoPagina.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import Table from '../components/ui/Table.jsx';
import { useConsulta } from '../hooks/useConsulta.js';
import { formatearFecha, formatearMoneda, formatearNumero } from '../utils/formato.js';
import estilos from './Dashboard.module.css';

const COLUMNAS_MOVIMIENTOS = [
  { clave: 'fecha', titulo: 'Fecha', sinCorte: true, celda: (m) => formatearFecha(m.fecha_hora) },
  { clave: 'producto', titulo: 'Producto', celda: (m) => m.producto.nombre },
  {
    clave: 'tipo',
    titulo: 'Tipo',
    celda: (m) => (
      <span className={estilos.tipo}>
        <BadgeMovimiento tipo={m.tipo_movimiento} />
        {m.anulado && <Badge>Anulado</Badge>}
      </span>
    ),
  },
  { clave: 'cantidad', titulo: 'Cantidad', numerico: true, celda: (m) => m.cantidad },
  { clave: 'usuario', titulo: 'Usuario', celda: (m) => m.usuario.nombre },
];

function Kpi({ etiqueta, valor, cargando, aviso }) {
  return (
    <Card className={aviso ? `${estilos.kpi} ${estilos.kpiAviso}` : estilos.kpi}>
      <p className={estilos.kpiEtiqueta}>{etiqueta}</p>
      {cargando ? <Skeleton ancho="60%" alto={32} /> : <p className={estilos.kpiValor}>{valor}</p>}
      {aviso && <Badge tono="alerta">{aviso}</Badge>}
    </Card>
  );
}

export default function Dashboard() {
  const { respuesta, error, cargando, recargar } = useConsulta('/dashboard');
  const datos = respuesta?.data;

  if (error && !datos) {
    return (
      <>
        <EncabezadoPagina titulo="Inicio" />
        <Card>
          <EmptyState icono="inicio" titulo="No se pudo cargar el resumen" mensaje={error}>
            <Button variante="ghost" onClick={recargar}>
              Reintentar
            </Button>
          </EmptyState>
        </Card>
      </>
    );
  }

  return (
    <>
      <EncabezadoPagina titulo="Inicio" descripcion="Resumen del estado del inventario" />

      <div className={estilos.zonaKpis}>
        <div className={estilos.kpis}>
          <Kpi
            etiqueta="Productos activos"
            cargando={cargando}
            valor={formatearNumero(datos?.total_productos ?? 0)}
          />
          <Kpi
            etiqueta="Categorías"
            cargando={cargando}
            valor={formatearNumero(datos?.total_categorias ?? 0)}
          />
          <Kpi
            etiqueta="Proveedores"
            cargando={cargando}
            valor={formatearNumero(datos?.total_proveedores ?? 0)}
          />
          <Kpi
            etiqueta="Bajo stock"
            cargando={cargando}
            valor={formatearNumero(datos?.bajo_stock ?? 0)}
            aviso={datos?.bajo_stock > 0 ? 'Requiere atención' : undefined}
          />
          <Kpi
            etiqueta="Valorización"
            cargando={cargando}
            valor={formatearMoneda(datos?.valorizacion ?? 0)}
          />
        </div>
      </div>

      <div className={estilos.detalle}>
        <Card titulo="Movimientos recientes" sinRelleno>
          <Table
            etiqueta="Últimos cinco movimientos"
            columnas={COLUMNAS_MOVIMIENTOS}
            filas={datos?.movimientos_recientes ?? []}
            cargando={cargando}
            vacio={<EmptyState icono="kardex" titulo="Todavía no hay movimientos" />}
          />
        </Card>

        <Card titulo="Stock por categoría">
          {cargando && <Skeleton alto={200} />}
          {datos && datos.stock_por_categoria.some(({ stock }) => stock > 0) && (
            <DonutChart datos={datos.stock_por_categoria} />
          )}
          {datos && !datos.stock_por_categoria.some(({ stock }) => stock > 0) && (
            <EmptyState icono="categorias" titulo="Todavía no hay stock registrado" />
          )}
        </Card>
      </div>
    </>
  );
}
