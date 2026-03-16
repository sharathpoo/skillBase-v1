"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? "register" : "login";
      const response = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(
          isSignup
            ? { username: formData.username, password: formData.password, role: formData.role }
            : { username: formData.username, password: formData.password }
        ),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        router.push(data.user?.role === "freelancer" ? "/freelancer" : "/user");
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const forcedInputStyle = {
    color: "#111827",
    WebkitTextFillColor: "#111827",
    caretColor: "#111827",
  } as const;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-4 -left-2 h-20 w-20 rounded-full bg-blue-500 opacity-10 animate-pulse sm:-top-6 sm:-left-6 sm:h-24 sm:w-24"></div>
        <div className="absolute -bottom-4 -right-2 h-24 w-24 rounded-full bg-purple-500 opacity-10 animate-pulse delay-150 sm:-bottom-6 sm:-right-6 sm:h-32 sm:w-32"></div>

        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-5 pt-6 pb-5 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 sm:px-8 sm:pt-8 sm:pb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-4xl">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {isSignup ? "Join our community today" : "Sign in to your account"}
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Type
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={forcedInputStyle}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-black caret-black outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="freelancer">Freelancer</option>
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={forcedInputStyle}
                  className="auth-input w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-black caret-black outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="M S Dhoni"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={forcedInputStyle}
                  className="auth-input w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-black caret-black outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 text-white font-medium bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSignup ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isSignup ? "Already have an account? " : "Don't have an account? "}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {isSignup ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
