const CLAVE_TOKEN = 'inventario_token';
const CLAVE_USUARIO = 'inventario_usuario';

export const leerToken = () => localStorage.getItem(CLAVE_TOKEN);

export const leerUsuario = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIO));
  } catch {
    return null;
  }
};

export const guardarToken = (token) => localStorage.setItem(CLAVE_TOKEN, token);

export const guardarUsuario = (usuario) => {
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
};

export const borrarSesion = () => {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
};
