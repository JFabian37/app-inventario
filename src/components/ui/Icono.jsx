// Iconos propios en SVG: heredan el color del texto que los rodea
const TRAZOS = {
  inicio: ['M3 11.5 12 4l9 7.5', 'M5.5 10v9.5h13V10', 'M10 19.5v-5.5h4v5.5'],
  productos: ['M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z', 'M4 7.5l8 4.5 8-4.5', 'M12 12v9'],
  categorias: ['M4 5h6.5v6.5H4z', 'M13.5 5H20v6.5h-6.5z', 'M4 14.5h6.5V21H4z', 'M13.5 14.5H20V21h-6.5z'],
  proveedores: ['M3 7h11v10H3z', 'M14 10.5h4l3 3.5v3h-7', 'M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  kardex: ['M6 3.5h9l4 4V20.5H6z', 'M14.5 3.5V8H19', 'M9 12.5h7', 'M9 16.5h7'],
  usuarios: ['M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z', 'M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6', 'M16 5a3.5 3.5 0 0 1 0 6.5', 'M18 14.5c1.8.8 3 2.8 3 5.5'],
  menu: ['M4 6.5h16', 'M4 12h16', 'M4 17.5h16'],
  cerrar: ['M6 6l12 12', 'M18 6 6 18'],
  salir: ['M14 4.5H6v15h8', 'M10.5 12H20', 'M16.5 8.5 20 12l-3.5 3.5'],
};

export default function Icono({ nombre, tamano = 20 }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TRAZOS[nombre].map((trazo) => (
        <path key={trazo} d={trazo} />
      ))}
    </svg>
  );
}
