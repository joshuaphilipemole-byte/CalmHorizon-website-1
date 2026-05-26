import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, HeartPulse, Moon, ShieldCheck, Sparkles, Users } from "lucide-react";
import heroImg from "@/assets/about-office.jpg";

const BASE_URL = "https://calmhorizon.health";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calm Horizon — Telehealth Psychiatry for Anxiety, Depression & ADHD" },
      { name: "description", content: "Virtual psychiatry for adults in CA, NY, and TX. Compassionate telehealth care for anxiety, depression, ADHD, mood, and medication management." },
      { property: "og:title", content: "Calm Horizon Telehealth Psychiatry" },
      { property: "og:description", content: "Virtual psychiatry for adults in CA, NY, and TX. Compassionate telehealth care for anxiety, depression, ADHD, mood, and medication management." },
      { property: "og:url", content: `${BASE_URL}/` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/` }],
  }),
  component: Home,
});

const services = [
  { icon: Brain, title: "Anxiety & Stress", desc: "Targeted care for generalized anxiety, panic, and burnout." },
  { icon: HeartPulse, title: "Depression", desc: "Evidence-based treatment plans tailored to your goals." },
  { icon: Sparkles, title: "ADD/ADHD", desc: "Comprehensive evaluation and ongoing medication management." },
  { icon: Moon, title: "Sleeping Disorder", desc: "Restore healthy sleep patterns as a foundation for mental wellbeing." },
  { icon: Users, title: "Life Transitions", desc: "Support through grief, relationships, and identity change." },
  { icon: ShieldCheck, title: "Medication Management", desc: "Careful, collaborative prescribing with regular follow-ups." },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Warm, welcoming office space for virtual psychiatric care"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur">
              Telehealth psychiatry
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Supporting Your Journey to Mental Wellness
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Calm Horizon provides compassionate, evidence-based mental health
              care tailored to each individual’s unique needs.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Book a consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-7 py-3.5 text-sm font-semibold text-primary backdrop-blur transition-colors hover:bg-card"
              >
                Explore services
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              {[
                { k: "10k+", v: "Sessions held" },
                { k: "4.9/5", v: "Patient rating" },
                { k: "48h", v: "Avg. response" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-2xl font-extrabold text-primary">{s.k}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Conditions treated</p>
            <h2 className="mt-3 text-4xl font-bold">Mental health care that meets you where you are.</h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-accent hover:underline">
            View all services →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="group rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Approach band */}
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-4xl px-6 py-32 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">My approach</p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.1] md:text-5xl">
            A steady, thoughtful, and evidence-based approach to care.
          </h2>
          <div className="mx-auto mt-10 h-px w-16 bg-accent/40" />
          <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Each treatment plan begins with a comprehensive 60-minute virtual evaluation designed to gain a full understanding of your history, concerns, and goals for care.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Treatment integrates medication management with practical, supportive therapeutic strategies. Ongoing care is collaborative and intentionally paced, allowing space for reflection, adjustment, and meaningful progress over time.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            The focus is on delivering attentive, individualized psychiatric care that is both clinically sound and grounded in consistency, clarity, and trust.
          </p>
        </div>
      </section>


      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="overflow-hidden rounded-3xl bg-hero-gradient px-10 py-16 text-center text-primary-foreground shadow-soft md:px-16">
          <h2 className="text-4xl font-bold text-primary-foreground md:text-5xl">
            Begin where you are.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/85">
            Reach out today for a free 15-minute virtual consultation. I'll listen
            first and help you decide what comes next.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
          >
            Schedule your consult <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
