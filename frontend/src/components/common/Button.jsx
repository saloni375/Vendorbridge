import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn.js";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border border-line bg-white text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-700 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  children,
  className,
  disabled,
  isLoading = false,
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
