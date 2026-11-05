# Capturas del Panel de Inventario

Capturas reales de la app, tomadas con datos de ejemplo. Sirven para la documentación de los laboratorios.

## Acceso

### Contraseña incorrecta (Validación)

El error de la API aparece en el formulario, sin recargar la página.

![Acceso: Contraseña incorrecta](01.png)

## Inicio

### Panel de inicio (Listado)

Cinco indicadores, movimientos recientes y stock por categoría.

![Inicio: Panel de inicio](02.png)

### Donut con el cursor encima (Listado)

El segmento crece y el centro muestra la categoría. La leyenda da las cifras exactas.

![Inicio: Donut con el cursor encima](03.png)

## Productos

### Listado (Listado)

Búsqueda, filtros, paginación del servidor y aviso de bajo stock.

![Productos: Listado](04.png)

### Búsqueda sin resultados (Listado)

Estado vacío con una indicación de qué hacer.

![Productos: Búsqueda sin resultados](05.png)

### Crear: campos obligatorios (Validación)

No se guarda sin categoría. Cada error aparece junto a su campo.

![Productos: Crear: campos obligatorios](06.png)

### Crear: error devuelto por la API (Validación)

El código ya existe: la API rechaza el registro y el error se pinta en su campo.

![Productos: Crear: error devuelto por la API](07.png)

### Crear: producto guardado (Toast)

Toast de éxito. El código P-0016 se generó solo y el stock inicial entró por el kardex.

![Productos: Crear: producto guardado](08.png)

### Editar (Diálogo)

Modal con los datos cargados. El stock queda bloqueado porque solo cambia por el kardex.

![Productos: Editar](09.png)

### Editar: cambios guardados (Toast)

La fila se actualiza sin recargar la página.

![Productos: Editar: cambios guardados](10.png)

### Eliminar: confirmación (Diálogo)

Diálogo propio, sin window.confirm. El foco inicia en Cancelar.

![Productos: Eliminar: confirmación](11.png)

### Eliminar con historial (Toast)

Tiene movimientos, así que queda inactivo. El toast explica lo que pasó.

![Productos: Eliminar con historial](12.png)

## Categorías

### Listado (Listado)

Cada categoría muestra cuántos productos activos tiene.

![Categorías: Listado](13.png)

### Crear: nombre repetido (Validación)

El nombre debe ser único. El error llega de la API.

![Categorías: Crear: nombre repetido](14.png)

### Crear: categoría guardada (Toast)

Toast de éxito con la fila nueva en el listado.

![Categorías: Crear: categoría guardada](15.png)

### Editar (Diálogo)

Al editar aparece la casilla para activar o desactivar.

![Categorías: Editar](16.png)

### Eliminar: confirmación (Diálogo)

Avisa que no se podrá eliminar si tiene productos.

![Categorías: Eliminar: confirmación](17.png)

### Eliminar: categoría vacía (Toast)

Sin productos asociados, se borra.

![Categorías: Eliminar: categoría vacía](18.png)

### Eliminar: categoría en uso (Toast)

Toast de error con el 409 de la API. La categoría sigue en la lista.

![Categorías: Eliminar: categoría en uso](19.png)

## Proveedores

### Listado (Listado)

Razón social, RUC, contacto, teléfono y correo.

![Proveedores: Listado](20.png)

### Crear: formato inválido (Validación)

RUC de 11 dígitos y correo válido, comprobados en el navegador.

![Proveedores: Crear: formato inválido](21.png)

### Crear: proveedor guardado (Toast)

Toast de éxito.

![Proveedores: Crear: proveedor guardado](22.png)

### Editar (Diálogo)

Modal con los datos cargados.

![Proveedores: Editar](23.png)

### Eliminar: confirmación (Diálogo)

Avisa que sus productos y movimientos quedarán sin proveedor.

![Proveedores: Eliminar: confirmación](24.png)

### Eliminar: proveedor borrado (Toast)

Toast de éxito.

![Proveedores: Eliminar: proveedor borrado](25.png)

## Kardex

### Listado (Listado)

Historial con tipo, stock anterior y nuevo, usuario y observaciones.

![Kardex: Listado](26.png)

### Registrar: buscar producto (Diálogo)

Busca por nombre o código y muestra el stock de cada resultado.

![Kardex: Registrar: buscar producto](27.png)

### Registrar: salida mayor al stock (Validación)

Se valida en el navegador, antes de llamar a la API.

![Kardex: Registrar: salida mayor al stock](28.png)

### Registrar: salida válida (Diálogo)

Muestra el stock que quedará después del movimiento.

![Kardex: Registrar: salida válida](29.png)

### Registrar: movimiento guardado (Toast)

La salida aparece primero, de 14 a 10 unidades.

![Kardex: Registrar: movimiento guardado](30.png)

### Anular: confirmación (Diálogo)

Solo el Administrador puede anular un movimiento.

![Kardex: Anular: confirmación](31.png)

### Anular: stock devuelto (Toast)

La fila queda marcada, se conserva en el historial y ya no se puede anular otra vez.

![Kardex: Anular: stock devuelto](32.png)

## Usuarios

### Listado (Listado)

Solo visible para el Administrador. Tu propia cuenta no se puede desactivar.

![Usuarios: Listado](33.png)

### Crear: campos obligatorios (Validación)

Nombre, correo y contraseña son obligatorios al crear.

![Usuarios: Crear: campos obligatorios](34.png)

### Crear: usuario guardado (Toast)

La cuenta queda lista para iniciar sesión.

![Usuarios: Crear: usuario guardado](35.png)

### Editar tu propia cuenta (Diálogo)

El rol queda bloqueado para no perder el acceso de administrador.

![Usuarios: Editar tu propia cuenta](36.png)

### Desactivar: confirmación (Diálogo)

Avisa que perderá el acceso de inmediato.

![Usuarios: Desactivar: confirmación](37.png)

### Desactivar: estado actualizado (Toast)

El botón cambia a Activar para poder revertirlo.

![Usuarios: Desactivar: estado actualizado](38.png)

## Permisos

### Supervisor: solo lectura (Listado)

Sin botón de crear ni columna de acciones, y sin Usuarios en el menú.

![Permisos: Supervisor: solo lectura](39.png)

### Pantalla 403 (Validación)

Entrar a una dirección sin permiso muestra el motivo, sin redirigir en silencio.

![Permisos: Pantalla 403](40.png)

## Móvil

### Menú deslizable (Listado)

Por debajo de 768 px, el menú lateral se abre sobre la página.

![Móvil: Menú deslizable](41.png)

### Tabla como tarjetas (Listado)

Cada fila se vuelve una tarjeta con sus etiquetas.

![Móvil: Tabla como tarjetas](42.png)

### Modal en móvil (Validación)

El formulario pasa a una columna y desplaza por dentro.

![Móvil: Modal en móvil](43.png)

### Confirmación en móvil (Diálogo)

El mismo diálogo, ajustado a la pantalla.

![Móvil: Confirmación en móvil](44.png)
