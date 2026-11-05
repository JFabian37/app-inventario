import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { alExpirarSesion } from '../services/api.js';
import {
  borrarSesion,
  guardarToken,
  guardarUsuario,
  leerToken,
  leerUsuario,
} from '../services/sesion.js';
import { AuthContexto } from './auth.js';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuario);
  // Con token guardado hay que confirmarlo con la API antes de mostrar la app
  const [cargando, setCargando] = useState(() => Boolean(leerToken()));

  useEffect(() => {
    alExpirarSesion(() => setUsuario(null));
    return () => alExpirarSesion(() => {});
  }, []);

  useEffect(() => {
    if (!leerToken()) return undefined;

    let vigente = true;

    // El rol guardado en localStorage se puede editar: el valido es el de la API
    api
      .get('/auth/perfil')
      .then(({ data }) => {
        if (!vigente) return;
        guardarUsuario(data.usuario);
        setUsuario(data.usuario);
      })
      .catch(() => {
        // Un 401 ya lo atendio el interceptor. Si la API no responde se conserva la sesion
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    guardarToken(data.token);
    guardarUsuario(data.usuario);
    setUsuario(data.usuario);

    return data.usuario;
  }, []);

  const logout = useCallback(() => {
    borrarSesion();
    setUsuario(null);
  }, []);

  const tienePermiso = useCallback(
    (...roles) => roles.length === 0 || roles.includes(usuario?.rol),
    [usuario],
  );

  const valor = useMemo(
    () => ({ usuario, cargando, login, logout, tienePermiso }),
    [usuario, cargando, login, logout, tienePermiso],
  );

  return <AuthContexto.Provider value={valor}>{children}</AuthContexto.Provider>;
}
