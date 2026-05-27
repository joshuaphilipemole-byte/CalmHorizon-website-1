import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import officeImg from "@/assets/Jane Nwankwo NP.JPG";

const BASE_URL = "https://calmhorizon.health";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Calm Horizon — Virtual Psychiatry Clinician" },
      { name: "description", content: "Meet Jane Nwankwo, a psychiatric mental health nurse practitioner offering compassionate virtual psychiatry and medication support for adults in CA, NY, and TX." },
      { property: "og:title", content: "About Calm Horizon Psychiatry" },
      { property: "og:description", content: "Meet Jane Nwankwo, a psychiatric mental health nurse practitioner offering compassionate virtual psychiatry and medication support for adults in CA, NY, and TX." },
      { property: "og:url", content: `${BASE_URL}/about` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/about` }],
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
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">Meet the clinician</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Jane Nwankwo, NP</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                A licensed psychiatric clinician committed to attentive,
                evidence-based virtual care.
              </p>

              <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
                <p>
                  Jane Nwankwo is a board-certified Psychiatric Mental Health Nurse Practitioner dedicated to providing compassionate, personalized, and evidence-based mental health care.
                </p>
                <p>
                  She believes mental health care should feel supportive, collaborative, and free of judgment. Jane is committed to creating a safe and welcoming space where patients feel heard, respected, and comfortable discussing their concerns.
                </p>
                <p>
                  Her approach is thoughtful, patient-centered, and focused on helping individuals achieve emotional wellness, balance, and improved quality of life. She values building genuine therapeutic relationships and meeting patients where they are in their mental health journey.
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://care.headway.co/providers/jane-nwankwo?utm_source=pem&utm_medium=direct_link&utm_campaign=121431"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition duration-200 hover:bg-primary/90"
                >
                  View Available Times
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3.5 text-sm font-semibold text-foreground transition duration-200 hover:border-primary hover:text-primary"
                >
                  Contact Jane
                </Link>
              </div>
            </div>

            <div className="max-w-[560px]">
              <img
                src={officeImg}
                alt="Calm, light-filled virtual therapy setting with teal accents"
                width={1600}
                height={900}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-3xl object-cover shadow-soft"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">My approach to therapy</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-extrabold leading-[1.05] md:text-6xl">
          Compassionate, client-centered mental health care with evidence-based support.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I take a compassionate, client-centered approach to care, focusing on creating
          a safe and open space for you to express yourself. By listening carefully to
          your concerns, we can work together to develop a treatment plan that’s right
          for you. I utilize a combination of therapy and evidence-based practices to
          help you build coping strategies and regain control of your mental health.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">What you can expect from me</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            In our sessions, you can expect to gain a deeper understanding of yourself and your mental health. My goal is to create a supportive and non-judgmental environment where you feel comfortable exploring your thoughts and emotions. Together, we’ll set realistic goals. By the end of our time together, I aim for you to feel empowered with tools and strategies that can help you navigate challenges and lead a more balanced, fulfilling life.
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
    </>
  );
}
