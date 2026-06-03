// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Input from "@/components/ui/Input";
// import Button from "@/components/ui/Button";
// import { authService } from "@/services/auth.service";
// import { useAuthStore } from "@/store/auth.store";

// // ── Validation Schema ──────────────────────────────────────
// const loginSchema = z.object({
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// // ── Component ──────────────────────────────────────────────
// export default function LoginPage() {
//   const router = useRouter();
//   const { setUser } = useAuthStore();
//   const [serverError, setServerError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginForm) => {
//     try {
//       setServerError("");
//       const response = await authService.login(data);

//       // Save tokens
//       localStorage.setItem("accessToken", response.data.tokens.accessToken);
//       localStorage.setItem("refreshToken", response.data.tokens.refreshToken);

//       // Save user to store
//       setUser(response.data.user);

//       // Redirect to dashboard
//       router.push("/dashboard");
//     } catch (error: any) {
//       setServerError(
//         error.response?.data?.message || "Something went wrong. Try again."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
//             <span className="text-white text-xl font-bold">I</span>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Sign in to continue your IELTS journey
//           </p>
//         </div>

//         {/* Server Error */}
//         {serverError && (
//           <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
//             {serverError}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//           <Input
//             label="Email"
//             type="email"
//             placeholder="you@email.com"
//             error={errors.email?.message}
//             {...register("email")}
//           />

//           <Input
//             label="Password"
//             type="password"
//             placeholder="Enter your password"
//             error={errors.password?.message}
//             {...register("password")}
//           />

//           {/* Forgot Password */}
//           <div className="text-right -mt-2">
//             <Link
//               href="/forgot-password"
//               className="text-sm text-blue-600 hover:underline"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           <Button type="submit" isLoading={isSubmitting} className="mt-2">
//             Sign In
//           </Button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center gap-3 my-6">
//           <hr className="flex-1 border-gray-200" />
//           <span className="text-xs text-gray-400">or continue with</span>
//           <hr className="flex-1 border-gray-200" />
//         </div>

//         {/* Google Login */}
//         <button className="w-full border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition text-sm font-medium text-gray-700">
//           <svg className="w-5 h-5" viewBox="0 0 24 24">
//             <path
//               fill="#4285F4"
//               d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//             />
//             <path
//               fill="#34A853"
//               d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//             />
//             <path
//               fill="#FBBC05"
//               d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//             />
//             <path
//               fill="#EA4335"
//               d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//             />
//           </svg>
//           Continue with Google
//         </button>

//         {/* Register Link */}
//         <p className="text-center text-sm text-gray-500 mt-6">
//           Don't have an account?{" "}
//           <Link
//             href="/register"
//             className="text-blue-600 font-medium hover:underline"
//           >
//             Sign up free
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
import { useAuth } from "@/hooks/useAuth";
import type { LoginDTO } from "@/types/auth.types";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();

  const sessionExpired = searchParams.get("session") === "expired";
  const passwordChanged = searchParams.get("reason") === "password_changed";

  const [form, setForm] = useState<LoginDTO>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue your IELTS preparation
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          {/* Session banners */}
          {sessionExpired && (
            <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-200">
              Your session expired. Please sign in again.
            </div>
          )}
          {passwordChanged && (
            <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
              Password changed. Please sign in with your new password.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={loginWithGoogle}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}
