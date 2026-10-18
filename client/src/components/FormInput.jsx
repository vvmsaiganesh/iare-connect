/**
 * Reusable labelled text input with inline validation error,
 * styled to match the IARE Connect design system.
 */
export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  required = false,
  mono = false,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
      >
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:ring-4 focus:ring-ring/15 ${
          mono ? 'font-mono' : ''
        } ${
          error
            ? 'border-destructive/60 focus:border-destructive focus:ring-destructive/15'
            : 'border-input focus:border-ring'
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
