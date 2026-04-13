"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navigation = [
    { name: "CV Builder", href: "/dashboard/cv", icon: "📄" },
    { name: "Cover Letter", href: "/dashboard/cover-letter", icon: "✉️" },
    { name: "Portfolio", href: "/dashboard/portfolio", icon: "🌐" },
    { name: "Pengaturan", href: "/dashboard/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen dot-bg" style={{ background: "var(--bg)" }}>
      {/* Mobile Header */}
      <div
        className="lg:hidden border-b px-4 py-3 flex items-center justify-between"
        style={{
          background: "var(--surface)",
          borderColor: "rgba(0,0,0,0.08)",
        }}
      >
        <h1
          className="text-xl font-orbitron font-bold"
          style={{ color: "var(--cyan)" }}
        >
          SIVI.ID
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-opacity-10"
          style={{ background: "transparent" }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 border-r transition-transform duration-300 ease-in-out`}
          style={{
            background: "var(--surface)",
            borderColor: "rgba(0,0,0,0.08)",
          }}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div
              className="hidden lg:flex items-center h-16 px-6 border-b"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <h1
                className="text-2xl font-orbitron font-bold"
                style={{ color: "var(--cyan)" }}
              >
                SIVI.ID
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-space ${
                      isActive ? "font-semibold" : "hover:bg-opacity-10"
                    }`}
                    style={
                      isActive
                        ? {
                            background: "var(--cyan-dim)",
                            color: "var(--cyan)",
                          }
                        : { color: "var(--text2)" }
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile */}
            <div
              className="p-4 border-t"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ background: "var(--cyan)" }}
                >
                  {user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
                    user?.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate font-space"
                    style={{ color: "var(--text)" }}
                  >
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: "var(--text3)" }}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm rounded-lg transition hover:bg-opacity-10 font-space"
                style={{ color: "var(--orange)" }}
              >
                Keluar
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
