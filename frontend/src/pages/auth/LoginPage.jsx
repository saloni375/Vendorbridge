import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../components/common/Button.jsx";
import FormInput from "../../components/common/FormInput.jsx";
import { useAuth } from "../../hooks/useAuth.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authError, clearAuthError, login } = useAuth();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    clearAuthError();
    await login(values);
    navigate(location.state?.from?.pathname || "/app/dashboard", { replace: true });
  };

  return (
    <div className="rounded-xl border border-line bg-white p-8 shadow-soft">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950">Login</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to your procurement workspace</p>
      </div>

      {authError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {authError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            className="focus-ring h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400"
            placeholder="name@company.com"
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            className="focus-ring h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400"
            placeholder="Enter your password"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <Button className="w-full" isLoading={isSubmitting} type="submit">
          Login
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        New to VendorBridge?{" "}
        <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/signup">
          Register
        </Link>
      </p>
    </div>
  );
}
