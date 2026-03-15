"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<{ role?: string; loggedIn: boolean }>({
    loggedIn: false,
  });

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/check_reg`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setAuthState({ loggedIn: true, role: data.user?.role });
          return;
        }
      } catch (error) {
        console.error("Failed to load session", error);
      }
      setAuthState({ loggedIn: false });
    };

    loadSession();
  }, [pathname]);

  if (pathname === "/" || pathname === "/login" || pathname === "/logout") {
    return null;
  }

  return (
    <nav className="fixed w-full top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3 sm:h-16 sm:flex-nowrap sm:py-0">
          <Link 
            href={authState.role === "freelancer" ? "/freelancer" : authState.loggedIn ? "/user" : "/login"}
            className="flex items-center space-x-2"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              SkillBase
            </span>
          </Link>

          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap sm:gap-3">
            {!authState.loggedIn && (
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-700 text-sm font-medium rounded-lg text-slate-200 bg-slate-900 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            )}

            {authState.loggedIn && authState.role === "freelancer" && (
              <button
                onClick={() => router.push('/freelancer')}
                className="inline-flex w-full items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto"
              >
                Freelancer Dashboard
              </button>
            )}

            {authState.loggedIn && (
              <button
                onClick={() => router.push('/logout')}
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-700 text-sm font-medium rounded-lg text-slate-200 bg-slate-900 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Responsive shadow overlay */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
    </nav>
  );
};

export default Navbar;
