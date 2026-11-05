// Convierte un error de axios en { mensaje, detalles } para mostrarlo en pantalla
export const leerError = (error) => {
  if (!error.response) {
    return { mensaje: 'No se pudo conectar con el servidor', detalles: {} };
  }

  const { error: mensaje, detalles } = error.response.data ?? {};

  return {
    mensaje: mensaje || 'Ocurrió un error inesperado',
    detalles: detalles ?? {},
  };
};
