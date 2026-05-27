import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

function parseICSToEvents(icsText: string) {
  const events: Array<any> = [];
  const blocks = icsText.split(/BEGIN:VEVENT/gi).slice(1);
  for (const block of blocks) {
    const get = (key: string) => {
      const re = new RegExp(key + ":(.*)", "i");
      const m = block.match(re);
      return m ? m[1].trim() : undefined;
    };
    const rawDtStart = get("DTSTART");
    const rawDtEnd = get("DTEND");
    const summary = get("SUMMARY") || "Event";
    const description = get("DESCRIPTION");
    const url = get("URL");

    function parseDate(raw: string | undefined) {
      if (!raw) return undefined;
      // Handle date-only YYYYMMDD
      if (/^\d{8}$/.test(raw)) {
        const y = raw.slice(0, 4);
        const m = raw.slice(4, 6);
        const d = raw.slice(6, 8);
        return new Date(`${y}-${m}-${d}T00:00:00`);
      }
      // Handle basic YYYYMMDDTHHMMSSZ or without Z
      const dt = raw.replace(/(T)(\d{2})(\d{2})(\d{2})/, (m, t, hh, mm, ss) => `${t}${hh}:${mm}:${ss}`);
      // If timezone suffix exists like Z or ;TZID=..., try using Date.parse fallback
      const iso = dt.includes("Z") || dt.includes("+") ? dt : dt.replace(/(\d{8}T\d{6})/, (m) => `${m.slice(0,4)}-${m.slice(4,6)}-${m.slice(6,8)}T${m.slice(9,11)}:${m.slice(11,13)}:${m.slice(13,15)}`);
      const parsed = Date.parse(iso);
      if (!isNaN(parsed)) return new Date(parsed);
      // Last resort: try inserting separators
      try {
        const y = raw.slice(0, 4);
        const mo = raw.slice(4, 6);
        const da = raw.slice(6, 8);
        const hh = raw.slice(9, 11) || "00";
        const mi = raw.slice(11, 13) || "00";
        const ss = raw.slice(13, 15) || "00";
        return new Date(`${y}-${mo}-${da}T${hh}:${mi}:${ss}`);
      } catch (e) {
        return undefined;
      }
    }

    const start = parseDate(rawDtStart);
    const end = parseDate(rawDtEnd);
    events.push({ title: summary, start, end: end || undefined, url, description });
  }
  return events;
}

export default function HeadwayCalendar({ icsUrl }: { icsUrl: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(icsUrl);
        if (!res.ok) throw new Error("Failed to fetch ICS");
        const text = await res.text();
        const ev = parseICSToEvents(text).filter((e) => e.start);
        if (mounted) setEvents(ev);
      } catch (err) {
        // ignore — keep events empty
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [icsUrl]);

  return (
    <div>
      {loading ? (
        <div className="mt-4 text-sm text-muted-foreground">Loading availability…</div>
      ) : (
        <div className="mt-4 rounded-2xl overflow-hidden border border-border bg-background">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
            events={events}
            eventClick={(info) => {
              info.jsEvent.preventDefault();
              const url = info.event.extendedProps.url || info.event.url;
              if (url) window.open(url, "_blank", "noopener,noreferrer");
              else alert(info.event.title + "\n\n" + (info.event.extendedProps.description || ""));
            }}
            height={560}
          />
        </div>
      )}
    </div>
  );
}
