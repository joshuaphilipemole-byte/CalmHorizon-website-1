import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
// To use your own logo: replace src/assets/logo.png with your file (same path & name).
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 md:h-24">
        <Link to="/" className="flex items-center text-primary" aria-label="Calm Horizon home">
          <img
            src={logo}
            alt="Calm Horizon logo"
            className="h-14 w-auto object-contain sm:h-16 md:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close mobile menu" : "Open mobile menu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            to="/contact"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
          >
            Book a consult
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 px-4 pb-4 shadow-soft">
          <nav className="mt-2 flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-card"
          >
            Book a consult
          </Link>
        </div>
      )}
    </header>
  );
}
