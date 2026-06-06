import { cn } from "../../utils/cn.js";

export default function FormSelect({
  error,
  id,
  label,
  options,
  placeholder = "Select option",
  registration,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700" htmlFor={id}>
        {label}
      </label>
      <select
        className={cn(
          "focus-ring h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-900",
          error ? "border-red-400" : "border-line"
        )}
        id={id}
        {...registration}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
