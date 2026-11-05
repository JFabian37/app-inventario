const moneda = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
const numero = new Intl.NumberFormat('es-PE');
const fechaHora = new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' });

export const formatearMoneda = (valor) => moneda.format(valor);
export const formatearNumero = (valor) => numero.format(valor);
export const formatearFecha = (valor) => fechaHora.format(new Date(valor));
