import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/missions", label: "Campaign" },
  { to: "/active", label: "Mission" },
  { to: "/schedule", label: "Schedule" },
  { to: "/media", label: "Media" },
  { to: "/updates", label: "Updates" },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col atmosphere overflow-hidden">
      <header className="border-b border-subtle bg-space-black/90 sticky top-0 z-50 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-display font-bold tracking-tight flex items-center gap-2">
            <span className="text-artemis-blue">◆</span>
            <span className="text-lunar-white/90">Artemis</span>
            <span className="text-lunar-white/50 font-normal">Hub</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-lunar-white bg-space-slate/60"
                      : "text-secondary hover:text-lunar-white hover:bg-space-slate/40"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-secondary hover:text-lunar-white"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-subtle bg-space-black">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-3 text-sm border-b border-subtle transition-colors ${
                    isActive ? "text-lunar-white bg-space-slate/40" : "text-secondary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full relative z-10">
        <Outlet />
      </main>

      <footer className="border-t border-subtle relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-faint">
          <p>Artemis Hub · NASA Open Data</p>
          <p className="flex items-center gap-3">
            <a
              href="https://subcult.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors"
            >
              SUBCULT
            </a>
            <span className="text-border-default">|</span>
            <a
              href="https://patreon.com/subcult"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors"
            >
              Support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}