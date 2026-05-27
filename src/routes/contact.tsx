import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, CalendarIcon, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const BASE_URL = "https://calmhorizon.health";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Book — Virtual Psychiatric Appointments" },
      { name: "description", content: "Schedule a telehealth psychiatry appointment with Calm Horizon. Virtual visits are available for adults in California, New York, and Texas." },
      { property: "og:title", content: "Book a Virtual Appointment — Calm Horizon" },
      { property: "og:description", content: "Schedule a telehealth psychiatry appointment with Calm Horizon. Virtual visits are available for adults in California, New York, and Texas." },
      { property: "og:url", content: `${BASE_URL}/contact` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/contact` }],
  }),
  component: ContactPage,
});

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
];

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  notes: z.string().trim().max(1000).optional(),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, "Please select a time"),
});

function ContactPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = bookingSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes") || undefined,
      date,
      time,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Get in touch</p>
        <h1 className="mt-3 text-5xl font-extrabold leading-[1.05] md:text-6xl">
          Book your virtual appointment.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Choose a date and time that works for you. I'll confirm your
          telehealth appointment within one business day.
        </p>
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { Icon: Mail, label: "Email", value: "hello@calmhorizon.health" },
          { Icon: Phone, label: "Phone", value: "Phone: \"(516)-475-9570\"" },
          { Icon: MapPin, label: "Service area", value: "Virtual telehealth — CA, NY, TX" },
          { Icon: Clock, label: "Hours", value: "Mon–Fri · 10am to 7pm" },
        ].map(({ Icon, label, value }) => (
          <li key={label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-primary">{label}</p>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          </li>
        ))}
      </ul>

      {submitted ? (
        <div className="mt-12 rounded-3xl border border-border bg-card p-12 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-accent">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h2 className="mt-6 text-3xl font-bold">Appointment requested</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            I've received your request for{" "}
            <span className="font-semibold text-primary">
              {date ? format(date, "EEEE, MMMM d") : ""} at {time}
            </span>
            . I'll reach out within one business day to confirm your virtual visit.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-12 grid gap-8 rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10 lg:grid-cols-[auto_1fr]"
        >
          {/* Calendar + time picker */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                <CalendarIcon className="h-4 w-4 text-accent" />
                Select a date
              </label>
              <div className="mt-3 inline-block rounded-2xl border border-border bg-background p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < today || d.getDay() === 0 || d.getDay() === 6}
                  className={cn("pointer-events-auto")}
                />
              </div>
              {errors.date && <p className="mt-2 text-xs text-destructive">{errors.date}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-primary">Available times</label>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-4">
                {TIME_SLOTS.map((slot) => {
                  const active = slot === time;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTime(slot)}
                      disabled={!date}
                      className={cn(
                        "rounded-lg border px-2 py-2 text-xs font-semibold transition-all",
                        active
                          ? "border-accent bg-accent text-accent-foreground shadow-card"
                          : "border-border bg-background text-primary hover:border-accent hover:text-accent",
                        !date && "cursor-not-allowed opacity-40",
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.time && <p className="mt-2 text-xs text-destructive">{errors.time}</p>}
            </div>
          </div>

          {/* Patient details */}
          <div className="space-y-5">
            <Field label="Full name" name="name" error={errors.name} required />
            <Field label="Email" name="email" type="email" error={errors.email} required />
            <Field label="Phone" name="phone" type="tel" error={errors.phone} required />
            <div>
              <label className="text-sm font-semibold text-primary">Notes (optional)</label>
              <textarea
                name="notes"
                rows={4}
                maxLength={1000}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
                placeholder="Briefly tell us what's going on…"
              />
              {errors.notes && <p className="mt-1 text-xs text-destructive">{errors.notes}</p>}
            </div>

            {date && time && (
              <div className="rounded-xl bg-secondary/60 px-4 py-3 text-sm text-primary">
                <span className="font-semibold">Selected:</span>{" "}
                {format(date, "EEEE, MMMM d")} · {time}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
            >
              Book an Appointment
            </button>
            <p className="text-xs text-muted-foreground">
              By submitting, you agree to be contacted about your inquiry. I
              never share your information.
            </p>
          </div>
        </form>
      )}
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-primary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
