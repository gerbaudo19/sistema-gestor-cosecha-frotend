interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const FormInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
}: FormInputProps) => {
  return (
    <div className="form-group">
      <label htmlFor={label} className="form-label">
        {label}
      </label>
      <input
        id={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input ${error ? 'form-input-error' : ''}`}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
