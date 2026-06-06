import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../components/common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { ROLE_OPTIONS } from "../../utils/roles.js";

export default function SignupPage() {
  const navigate = useNavigate();
  const { authError, clearAuthError, signup } = useAuth();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      role: "", country: "", additionalInfo: "",
    },
  });

  const onSubmit = async (values) => {
    clearAuthError();
    await signup({ ...values, fullName: `${values.firstName} ${values.lastName}` });
    navigate("/app/dashboard", { replace: true });
  };

  return (
    <div className="rounded-xl border border-line bg-white p-8 shadow-soft">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950">Register</h1>
        <p className="mt-1 text-sm text-gray-500">Create your VendorBridge account</p>
      </div>

      {authError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {authError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              className="focus-ring h-10 w-full rounded-lg border border-line bg-white px-3 text-sm placeholder:text-gray-400"
              placeholder="First Name"
              {...register("firstName", { required: "Required" })}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              className="focus-ring h-10 w-full rounded-lg border border-line bg-white px-3 text-sm placeholder:text-gray-400"
              placeholder="Last Name"
              {...register("lastName", { required: "Required" })}
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            className="focus-ring h-10 w-full rounded-lg border border-line bg-white px-3 text-sm placeholder:text-gray-400"
            placeholder="name@company.com"
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            className="focus-ring h-10 w-full rounded-lg border border-line bg-white px-3 text-sm placeholder:text-gray-400"
            placeholder="+91 00000 00000"
            type="tel"
            {...register("phone")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role (Admin, Officer)</label>
            <select
              className="focus-ring h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-gray-900"
              {...register("role", { required: "Role is required" })}
            >
              <option value="">Select role</option>
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              className="focus-ring h-10 w-full rounded-lg border border-line bg-white px-3 text-sm placeholder:text-gray-400"
              placeholder="India"
              {...register("country")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information ....</label>
          <textarea
            className="focus-ring w-full rounded-lg border border-line bg-white px-3 py-2 text-sm placeholder:text-gray-400 resize-none"
            rows={3}
            placeholder="Company name, department, or other details..."
            {...register("additionalInfo")}
          />
        </div>

        <Button className="w-full" isLoading={isSubmitting} type="submit">
          Register
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Already registered?{" "}
        <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
