import { useEffect } from "react";

const HEADWAY_URL = "https://care.headway.co/providers/jane-nwankwo?utm_source=pem&utm_medium=direct_link&utm_campaign=121431";
const WIDGET_SCRIPT_SRC = "https://cdn.headwayapp.co/widget.js";

export function HeadwayScheduleWidget() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const anyWindow = window as any;
    if (anyWindow._headwayScheduleLoaded) return;
    anyWindow._headwayScheduleLoaded = true;

    anyWindow.headwaySettings = {
      selector: ".headway-schedule-badge",
      account: "jane-nwankwo",
      position: "right",
      locale: "en",
      openOnInit: false,
    };

    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block">
      <a
        href={HEADWAY_URL}
        target="_blank"
        rel="noopener"
        className="headway-schedule-badge inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
      >
        View Jane’s schedule
      </a>
    </div>
  );
}
