import { useEffect, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CALENDAR_URL =
  "https://care.headway.co/providers/jane-nwankwo?utm_source=pem&utm_medium=direct_link&utm_campaign=121431";
const HEADWAY_SCRIPT_SRC = "https://cdn.headwayapp.co/widget.js";

declare global {
  interface Window {
    Headway?: any;
    HeadwayWidget?: any;
    openHeadwayCalendar?: () => void;
  }
}

function tryOpenHeadwayWidget() {
  if (typeof window === "undefined") {
    return false;
  }

  const headway = window.Headway || window.HeadwayWidget;
  if (!headway) {
    return false;
  }

  if (typeof headway.open === "function") {
    headway.open();
    return true;
  }
  if (typeof headway.show === "function") {
    headway.show();
    return true;
  }
  if (typeof headway.widget?.open === "function") {
    headway.widget.open();
    return true;
  }

  return false;
}

function loadHeadwayScript() {
  if (typeof document === "undefined") {
    return;
  }

  if (document.querySelector(`script[src="${HEADWAY_SCRIPT_SRC}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.src = HEADWAY_SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

export function HeadwayCalendarLoader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadHeadwayScript();

    const handleOpen = () => {
      const opened = tryOpenHeadwayWidget();
      if (!opened) {
        setOpen(true);
      }
    };

    window.openHeadwayCalendar = handleOpen;
    window.addEventListener("openHeadwayCalendar", handleOpen);

    return () => {
      window.removeEventListener("openHeadwayCalendar", handleOpen);
    };
  }, []);

  const close = () => setOpen(false);
  const open = () => {
    const opened = tryOpenHeadwayWidget();
    if (!opened) {
      setOpen(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 hidden rounded-full border border-border bg-background/95 px-4 py-2 shadow-soft backdrop-blur-sm md:block">
        <button
          type="button"
          onClick={open}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
        >
          <CalendarDays className="h-4 w-4" />
          Open scheduling calendar
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 flex items-stretch bg-background/40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="relative ml-auto flex h-full w-full max-w-4xl flex-col bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-accent">Headway booking</p>
              <h2 className="mt-2 text-lg font-semibold">Schedule your appointment</h2>
            </div>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Close calendar overlay"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              title="Provider booking calendar"
              src={CALENDAR_URL}
              className="h-full w-full border-none"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export function HeadwayCalendarButton({
  className,
  label = "Open calendar",
}: {
  className?: string;
  label?: string;
}) {
  const clickHandler = () => {
    if (typeof window === "undefined") {
      return;
    }

    const event = new Event("openHeadwayCalendar");
    window.dispatchEvent(event);
  };

  return (
    <button
      type="button"
      onClick={clickHandler}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-primary bg-background px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5",
        className
      )}
    >
      {label}
    </button>
  );
}
