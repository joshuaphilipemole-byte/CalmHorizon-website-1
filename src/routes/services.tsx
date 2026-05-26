import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, HeartPulse, Sparkles, Sun, Users, ShieldCheck, Moon, Wind } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Calm Horizon Psychiatry" },
      { name: "description", content: "Virtual telehealth psychiatry services including anxiety, depression, ADHD, mood disorders, and medication management." },
      { property: "og:title", content: "Services at Calm Horizon" },
      { property: "og:description", content: "What I treat and how care works." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Brain, title: "Anxiety & Panic", desc: "Generalized anxiety, panic disorder, social anxiety, and health anxiety." },
  { icon: HeartPulse, title: "Depression", desc: "Major depressive disorder, persistent depressive disorder, postpartum." },
  { icon: Sparkles, title: "ADD/ADHD", desc: "Adult ADHD evaluation and ongoing medication management." },
  { icon: Sun, title: "Bipolar Spectrum", desc: "Bipolar I, II, and cyclothymic disorder — stabilization and maintenance." },
  { icon: Moon, title: "Sleep & Insomnia", desc: "Address sleep as a foundation for mental health recovery." },
  { icon: Wind, title: "Trauma & PTSD", desc: "Medication support alongside trauma-informed therapy." },
  { icon: Users, title: "Life Transitions", desc: "Grief, relationship change, career shifts, and identity work." },
  { icon: ShieldCheck, title: "Medication Management", desc: "Careful prescribing, regular check-ins, and side-effect monitoring." },
];

function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Services</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-extrabold leading-[1.05] md:text-6xl">
          Specialized psychiatric care for the conditions I know best.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          All visits are conducted virtually via secure telehealth. I currently serve
          patients ages 18+ in California, New York, and Texas.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="text-3xl font-bold">Pricing & insurance</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: "Initial evaluation", p: "$350", d: "60-minute virtual intake with a psychiatric clinician." },
              { t: "Follow-up visit", p: "$175", d: "25–30 minute telehealth follow-up and medication review." },
              { t: "Therapy add-on", p: "$200", d: "45-minute virtual supportive therapy session." },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <h3 className="text-lg font-bold">{x.t}</h3>
                <p className="mt-2 text-3xl font-extrabold text-accent">{x.p}</p>
                <p className="mt-3 text-sm text-muted-foreground">{x.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            I'm in-network with Aetna, Cigna, and United. I provide
            superbills for out-of-network reimbursement.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-card"
          >
            Book a consult
          </Link>
        </div>
      </section>
    </>
  );
}
