/*
 * [CONFIRM: the six components below describe the Stark & Barker Growth System
 * in general terms. Swap in Ken's exact services here before publishing if he
 * wants them named precisely. Preserved verbatim from the approved brief for now.]
 */
const growthSystem = [
  {
    number: "01",
    name: "Find the revenue leaks.",
    body: "We examine the places where attention, leads, conversations, and sales are being lost, so you can stop guessing what to fix first.",
  },
  {
    number: "02",
    name: "Clarify the offer and message.",
    body: "We make it easier for the right prospects to understand what you do, why it matters, and why they should take the next step now.",
  },
  {
    number: "03",
    name: "Build the path to action.",
    body: "We organize the journey from first impression to inquiry, consultation, purchase, or booked appointment, so prospects are not left to figure it out on their own.",
  },
  {
    number: "04",
    name: "Strengthen follow-up.",
    body: "We help build the follow-up structure that keeps good opportunities from disappearing simply because nobody stayed in contact.",
  },
  {
    number: "05",
    name: "Turn activity into decisions.",
    body: "You get a clearer view of what is being tested, what the market is telling us, and what should happen next, without needing a marketing degree to understand it.",
  },
  {
    number: "06",
    name: "Keep the system moving.",
    body: "The goal is not a beautiful plan that sits untouched. It is to make the next useful improvement, learn from the response, and keep compounding what works.",
  },
]

const whatItMeans = [
  "Fewer disconnected marketing activities",
  "A clearer explanation of where growth is being blocked",
  "A better fit between your offer, your message, and your buyer",
  "More consistent follow-up with the opportunities you already paid to create",
  "A practical order of operations instead of another overwhelming list",
  "A marketing system that becomes easier to understand over time",
]

const whatYouGet = [
  "A focused review of the path between your marketing and your revenue",
  "A prioritized list of the most important leaks to address first",
  "Clearer offer and message direction",
  "A practical conversion path for the prospects you want more of",
  "Follow-up recommendations designed to protect the opportunities you are already generating",
  "A decision-making rhythm that replaces endless research with useful market feedback",
]

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-4 text-base text-foreground/85 sm:text-lg">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Subheading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-16 text-xs font-bold uppercase tracking-[0.22em] text-primary sm:mt-20">
      {children}
    </h3>
  )
}

export function OfferSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 sm:px-8 sm:py-28">
      <div className="mb-10 h-px w-16 bg-primary/60 sm:mb-14" aria-hidden="true" />

      <h2 className="font-sans text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
        A clearer path from marketing spend to revenue
      </h2>

      <p className="mt-8 text-lg leading-relaxed text-foreground/85 sm:text-xl">
        The Stark &amp; Barker Growth System is built for owners and operators
        who want growth they can understand and improve, not another marketing
        project that keeps them dependent on an agency.
      </p>

      <ol className="mt-14 space-y-12 sm:mt-20 sm:space-y-14">
        {growthSystem.map((item) => (
          <li
            key={item.number}
            className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 sm:gap-x-10"
          >
            <span className="font-sans text-lg font-bold tabular-nums tracking-wide text-primary sm:text-xl">
              {item.number}
            </span>
            <h3 className="self-baseline font-sans text-xl font-bold leading-tight text-foreground sm:text-2xl">
              {item.name}
            </h3>
            <span aria-hidden="true" />
            <p className="text-base leading-relaxed text-foreground/80 sm:text-lg">
              {item.body}
            </p>
          </li>
        ))}
      </ol>

      <Subheading>What this means for you</Subheading>
      <BulletList items={whatItMeans} />

      <Subheading>The cost of waiting</Subheading>
      <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
        <p>
          Every month you leave the leaks untouched, you are not standing
          still. You are paying for attention that does not become
          conversations, conversations that do not become opportunities, and
          opportunities that disappear because the next step was unclear.
        </p>
        <p>
          You do not need to gamble on another giant marketing plan. You need
          to know what is happening, decide what matters most, and move.
        </p>
      </div>

      <Subheading>When you work with Stark &amp; Barker, you are getting:</Subheading>
      <BulletList items={whatYouGet} />

      <p className="mt-16 border-l-2 border-primary pl-6 text-lg font-medium leading-relaxed text-foreground sm:mt-20 sm:text-xl">
        The value is not another report. The value is knowing what to do next,
        and having a system that helps you keep moving.
      </p>

      <div className="mt-14 sm:mt-16">
        <a
          href="#audit-form"
          className="group inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 text-base font-bold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90 sm:text-lg"
        >
          Show Me What To Fix First
        </a>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          Take the first step toward marketing you can understand, improve,
          and trust.
        </p>
      </div>
    </section>
  )
}
