import Campo from './Campo.jsx';

export default function Select({ label, error, ayuda, id, className, children, ...resto }) {
  return (
    <Campo label={label} error={error} ayuda={ayuda} id={id} className={className}>
      {(control) => (
        <select {...control} {...resto}>
          {children}
        </select>
      )}
    </Campo>
  );
}
