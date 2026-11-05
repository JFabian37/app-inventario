import axios from 'axios';
import { borrarSesion, leerToken } from './sesion.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let avisarSesionExpirada = () => {};

// AuthContext se registra aqui para enterarse cuando la API rechaza la sesion
export const alExpirarSesion = (callback) => {
  avisarSesionExpirada = callback;
};

// Inyecta el token en todas las peticiones: ningun componente arma este header a mano
api.interceptors.request.use((config) => {
  const token = leerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Un 401 en el login es una clave incorrecta, no una sesion vencida
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const esLogin = error.config?.url === '/auth/login';

    if (error.response?.status === 401 && !esLogin) {
      borrarSesion();
      avisarSesionExpirada();
    }

    return Promise.reject(error);
  },
);

export default api;
