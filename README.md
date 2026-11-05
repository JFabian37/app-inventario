# Panel de Inventario

Frontend del Panel Administrativo de Inventario, hecho con React y Vite. Incluye dashboard, productos, categorías, proveedores, kardex y usuarios, con autenticación JWT y permisos por rol.

Necesita la API del repositorio `api-db` en funcionamiento. Las capturas de cada vista están en [docs/capturas](docs/capturas/README.md).

## Requisitos

- Node.js 20.19 o superior (probado con Node 24)
- La API corriendo en `http://localhost:3006`

La terminal de Laragon puede usar Node 18, que no sirve para Vite 8. Comprueba la versión con `node -v`.

## Instalación

```bash
npm install
cp .env.example .env     # en PowerShell: Copy-Item .env.example .env
npm run dev
```

Abre `http://localhost:5173`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve esa versión para revisarla |
| `npm run lint` | Revisa el código con ESLint |

## Variables de entorno

| Variable | Ejemplo | Descripción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3006/api` | URL base de la API |

## Usuarios de prueba

Los crea `npm run seed` en la API, con las contraseñas de su `.env`. Son solo para desarrollo.

| Rol | Correo | Contraseña sugerida |
|---|---|---|
| Administrador | `admin@inventario.test` | `Admin123*` |
| Almacenero | `almacenero@inventario.test` | `Almacen123*` |

Para probar el rol Supervisor, créalo desde la vista Usuarios.

## Permisos por rol

La interfaz oculta lo que cada rol no puede hacer. La regla real está en la API: ocultar un botón no protege nada por sí solo.

| Vista | Administrador | Almacenero | Supervisor |
|---|---|---|---|
| Inicio | Ver | Ver | Ver |
| Productos | Todo | Crear y editar | Ver |
| Categorías | Todo | Ver | Ver |
| Proveedores | Todo | Ver | Ver |
| Kardex | Registrar y anular | Registrar | Ver |
| Usuarios | Todo | Sin acceso (403) | Sin acceso (403) |

## Endpoints que consume

Todas las peticiones pasan por `src/services/api.js`, que agrega el token y atiende los 401. El detalle completo está en el README de la API.

| Vista | Endpoints |
|---|---|
| Login | `POST /auth/login`, `GET /auth/perfil` |
| Inicio | `GET /dashboard` |
| Productos | `GET`, `POST /productos`; `PUT`, `DELETE /productos/:id`; `GET /categorias`, `GET /proveedores` |
| Categorías | `GET`, `POST /categorias`; `PUT`, `DELETE /categorias/:id` |
| Proveedores | `GET`, `POST /proveedores`; `PUT`, `DELETE /proveedores/:id` |
| Kardex | `GET`, `POST /movimientos`; `PATCH /movimientos/:id/anular`; `GET /productos`, `GET /proveedores` |
| Usuarios | `GET /usuarios`, `POST /auth/register`, `PUT /usuarios/:id`, `PATCH /usuarios/:id/estado` |

## Estructura

```text
src/
  components/
    formularios/   Formularios de cada recurso, dentro de un modal
    layout/        AppLayout, Sidebar, Topbar y ProtectedRoute
    ui/            Design system: Button, Input, Table, Modal, Toast...
    DonutChart.jsx Gráfico en SVG puro
  context/         Sesión: AuthContext y useAuth
  hooks/           useListado, useConsulta, useFormulario, useConfirmacion...
  pages/           Una vista por ruta
  services/        Cliente de la API y almacenamiento de la sesión
  utils/           Formatos, errores y roles
  index.css        Variables del design system
```

### Hooks principales

| Hook | Para qué sirve |
|---|---|
| `useConsulta` | GET con estados de carga y error, que descarta respuestas viejas |
| `useListado` | Listado con búsqueda con debounce, filtros y paginación del servidor |
| `useFormulario` | Valores, validación, envío y errores por campo de la API |
| `useConfirmacion` | Flujo pedir, confirmar y avisar de las acciones destructivas |

## Design system

Los colores, espacios, radios y tiempos son variables en `src/index.css`. Cada componente tiene su CSS Module y solo usa esas variables.

| Elemento | Valor |
|---|---|
| Fondo y superficies | `#F5F7FA` y blanco |
| Sidebar | `#0B1F3A` a `#10294D` |
| Acento | `#0B63CE` |
| Tipografía | Inter, incluida en el proyecto, con números tabulares |
| Radios | 10 y 12 px |
| Espaciado | Múltiplos de 4 px |
| Transiciones | 150 ms, desactivadas con `prefers-reduced-motion` |

Las tablas se convierten en tarjetas por debajo de 768 px, y el sidebar pasa a ser un menú deslizable.

Los colores del gráfico están separados de los de estado y se asignan por categoría, no por posición: si cambia el stock, ninguna categoría cambia de color.
