const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  helpText,
  options = [],
  theme = "light",
}) => {
  const baseInputClass = "w-full p-2 rounded border";
  const borderClass = error ? "border-red-500" : "border-gray-300";
  const darkInputClass = "bg-gray-800 text-white placeholder-gray-400";
  const lightInputClass = "bg-white text-black placeholder-gray-500";

  const inputClass = `${baseInputClass} ${borderClass} ${
    theme === "dark" ? darkInputClass : lightInputClass
  }`;

  // Help text & error text classes adapted for dark mode
  const helpTextClass =
    theme === "dark"
      ? "text-gray-400 mt-1 text-sm"
      : "text-gray-500 mt-1 text-sm";
  const errorTextClass =
    theme === "dark"
      ? "text-red-400 mt-1 text-sm"
      : "text-red-600 mt-1 text-sm";

  const selectClass = `${inputClass} appearance-none ${
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
  }`;

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "select" ? (
        <select className={selectClass} value={value} onChange={onChange}>
          <option
            value=""
            disabled
            hidden
            className={theme === "dark" ? "bg-gray-800 text-gray-400" : ""}
          >
            Select...
          </option>
          {options.map((opt) => (
            <option
              key={opt}
              value={opt}
              className={theme === "dark" ? "bg-gray-800 text-white" : ""}
            >
              {opt}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className={inputClass}
          value={value}
          onChange={onChange}
          rows={4}
          placeholder={helpText || ""}
        />
      ) : (
        <input
          type={type}
          className={inputClass}
          value={value}
          onChange={onChange}
          placeholder={helpText || ""}
        />
      )}

      {helpText && <p className={helpTextClass}>{helpText}</p>}
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
};

export default FormField;
