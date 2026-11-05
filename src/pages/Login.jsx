import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Icono from '../components/ui/Icono.jsx';
import Input from '../components/ui/Input.jsx';
import PantallaCarga from '../components/layout/PantallaCarga.jsx';
import { useAuth } from '../context/auth.js';
import { leerError } from '../utils/errores.js';
import estilos from './Login.module.css';

const validar = ({ email, password }) => {
  const errores = {};

  if (!email.trim()) errores.email = 'Ingresa tu correo';
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errores.email = 'El correo no es válido';

  if (!password) errores.password = 'Ingresa tu contraseña';

  return errores;
};

export default function Login() {
  const { usuario, cargando, login } = useAuth();
  const { state } = useLocation();
  const [formulario, setFormulario] = useState({ email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (cargando) return <PantallaCarga />;

  // Al iniciar sesion, usuario cambia y este redirect lleva a la pagina pedida
  if (usuario) return <Navigate to={state?.desde ?? '/'} replace />;

  const alCambiar = ({ target: { name, value } }) => {
    setFormulario((actual) => ({ ...actual, [name]: value }));
    setErrores((actuales) => ({ ...actuales, [name]: undefined }));
  };

  const alEnviar = async (evento) => {
    evento.preventDefault();
    setErrorGeneral('');

    const encontrados = validar(formulario);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      await login(formulario.email.trim(), formulario.password);
    } catch (error) {
      const { mensaje, detalles } = leerError(error);
      setErrores(detalles);
      setErrorGeneral(mensaje);
      setEnviando(false);
    }
  };

  return (
    <div className={estilos.pantalla}>
      <section className={estilos.marca} aria-label="Presentación">
        <span className={estilos.logo}>
          <Icono nombre="productos" tamano={28} />
        </span>
        <p className={estilos.nombre}>Panel de Inventario</p>
        <p className={estilos.lema}>
          Stock, proveedores y kardex de tu almacén en un solo lugar.
        </p>
      </section>

      <main className={estilos.lado}>
        <form className={estilos.formulario} onSubmit={alEnviar} noValidate>
          <div>
            <h1 className={estilos.titulo}>Iniciar sesión</h1>
            <p className={estilos.subtitulo}>Ingresa con tu cuenta para continuar.</p>
          </div>

          {errorGeneral && (
            <p className={estilos.alerta} role="alert">
              {errorGeneral}
            </p>
          )}

          <Input
            label="Correo"
            name="email"
            type="email"
            autoComplete="username"
            value={formulario.email}
            onChange={alCambiar}
            error={errores.email}
            autoFocus
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formulario.password}
            onChange={alCambiar}
            error={errores.password}
          />

          <Button type="submit" className={estilos.enviar} cargando={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>
      </main>
    </div>
  );
}
