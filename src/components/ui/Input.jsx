import Campo from './Campo.jsx';

export default function Input({ label, error, ayuda, id, className, ...resto }) {
  return (
    <Campo label={label} error={error} ayuda={ayuda} id={id} className={className}>
      {(control) => <input {...control} {...resto} />}
    </Campo>
  );
}
