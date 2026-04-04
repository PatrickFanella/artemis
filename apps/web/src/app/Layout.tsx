import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/missions", label: "Campaign" },
  { to: "/active", label: "Live Mission", live: true },
  { to: "/schedule", label: "Schedule" },
  { to: "/media", label: "Media" },
  { to: "/updates", label: "Updates" },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-space-gray/50 bg-space-dark/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="text-artemis-gold">Artemis</span>{" "}
            <span className="text-lunar-white/80">Hub</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `text-sm transition-colors flex items-center gap-1.5 ${isActive ? "text-artemis-blue font-medium" : "text-lunar-white/70 hover:text-lunar-white"}`
                }
              >
                {item.live && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-active opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-active" />
                  </span>
                )}
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-lunar-white/70"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-space-gray/50 bg-space-dark">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm border-b border-space-gray/20 transition-colors ${isActive ? "text-artemis-blue bg-space-gray/20" : "text-lunar-white/70"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <Outlet />
      </main>

      <footer className="border-t border-space-gray/50 bg-space-dark/50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-lunar-white/40">
          Artemis Hub — Powered by NASA Open Data
        </div>
      </footer>
    </div>
  );
}
