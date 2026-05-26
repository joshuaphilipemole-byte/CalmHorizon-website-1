import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center text-primary">
            <img src={logo} alt="Calm Horizon logo" className="h-10 w-auto object-contain" />
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Compassionate, evidence-based virtual psychiatric care for adults
            navigating anxiety, depression, ADHD, and life transitions.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>hello@calmhorizon.health</li>
            <li>(415) 555-0142</li>
            <li>Virtual telehealth across CA, NY, TX</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Calm Horizon Psychiatry. All rights reserved.
      </div>
    </footer>
  );
}
