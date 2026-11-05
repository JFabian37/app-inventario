import Campo from './Campo.jsx';

export default function Textarea({ label, error, ayuda, id, className, ...resto }) {
  return (
    <Campo label={label} error={error} ayuda={ayuda} id={id} className={className}>
      {(control) => <textarea {...control} {...resto} />}
    </Campo>
  );
}
