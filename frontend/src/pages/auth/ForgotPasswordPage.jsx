import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../components/common/Button.jsx";
import FormInput from "../../components/common/FormInput.jsx";
import { authService } from "../../services/authService.js";

export default function ForgotPasswordPage() {
  const {
    formState: { errors, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await authService.forgotPassword(values);
    } catch (error) {
      setError("root", { message: error.message });
    }
  };

  return (
    <div className="rounded-lg border border-line bg-white p-6 shadow-soft sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase text-brand-600">Password Recovery</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-950">Reset password</h1>
      </div>

      {errors.root?.message ? (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.root.message}
        </div>
      ) : null}

      {isSubmitSuccessful ? (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Password reset instructions were sent to your email.
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          error={errors.email?.message}
          id="forgotEmail"
          label="Email"
          placeholder="name@company.com"
          registration={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
          type="email"
        />

        <Button className="w-full" isLoading={isSubmitting} type="submit">
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Remembered it?{" "}
        <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/login">
          Back to login
        </Link>
      </p>
    </div>
  );
}
