import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return <AuthForm />;
}

/*

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? `register` : "login";
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
      if(data.success) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-gray-900">
      <div className="relative w-full max-w-md">
        Decorative elements
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500 rounded-full opacity-10 animate-pulse delay-150"></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          Header
          <div className="px-8 pt-8 pb-6 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {isSignup ? "Join our community today" : "Sign in to your account"}
            </p>
          </div>

          Form
          <div className="p-8">
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
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors dark:text-white"
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
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors dark:text-white"
                  placeholder="johndoe"
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
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-colors dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 text-white font-medium bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSignup ? "Create Account" : "Sign In"}
              </button>
            </form>

            Toggle between login and signup
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
};

export default LoginPage;
*/
