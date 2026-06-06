import { cn } from "../../utils/cn.js";

export default function FormInput({
  error,
  id,
  label,
  registration,
  type = "text",
  ...props
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700" htmlFor={id}>
        {label}
      </label>
      <input
        className={cn(
          "focus-ring h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400",
          error ? "border-red-400" : "border-line"
        )}
        id={id}
        type={type}
        {...registration}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
