import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import officeImg from "@/assets/Jane Nwankwo NP.JPG";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Calm Horizon Psychiatry" },
      { name: "description", content: "Meet Jane Nwankwo, a board-certified psychiatric mental health nurse practitioner delivering compassionate, evidence-based virtual mental health care." },
      { property: "og:title", content: "About Calm Horizon" },
      { property: "og:description", content: "Mission, values, and clinical approach." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  { t: "Patient first", d: "You set the pace and the goals. I bring the expertise and stay accountable." },
  { t: "Evidence-led", d: "Treatment plans grounded in current psychiatric research and best practices." },
  { t: "Whole person", d: "Sleep, work, relationships, and identity all shape mental health — I treat them as one." },
  { t: "Transparent", d: "Clear pricing, plain-language explanations, and no surprise costs." },
];

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">About Calm Horizon</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-extrabold leading-[1.05] md:text-6xl">
          A modern psychiatry practice built around trust.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I take a compassionate, client-centered approach to care, focusing on creating
          a safe and open space for you to express yourself. By listening carefully to
          your concerns, we can work together to develop a treatment plan that's right
          for you. I utilize a combination of therapy and evidence-based practices to
          help you build coping strategies and regain control of your mental health.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">My mission</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            To make excellent psychiatric care accessible, unhurried, and
            grounded in the science of what works — so every patient has a
            clearer horizon ahead.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold">What I believe</h2>
          <ul className="mt-6 space-y-4">
            {values.map((v) => (
              <li key={v.t} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-bold text-primary">{v.t}</p>
                  <p className="text-sm text-muted-foreground">{v.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold md:text-4xl">Meet the clinician</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              A licensed psychiatric clinician committed to attentive,
              evidence-based virtual care.
            </p>
          </div>

          <img
            src={officeImg}
            alt="Calm, light-filled virtual therapy setting with teal accents"
            width={1600}
            height={900}
            loading="lazy"
            className="mt-12 aspect-[16/9] w-full rounded-3xl object-cover shadow-soft"
          />

          <div className="mt-12 grid gap-8 md:grid-cols-1">
            <article className="mx-auto max-w-2xl border-t border-border pt-8 text-center">
              <h3 className="text-2xl font-bold">Jane Nwankwo, NP</h3>
              <p className="mt-1 text-sm font-semibold text-accent">Psychiatric Mental Health NP</p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Anxiety, ADD/ADHD, Bipolar disorder, Depression, OCD, Sleep disorder,
                Trauma, 1 Year Experience.
              </p>
            </article>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-card"
            >
              Book a consult
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
