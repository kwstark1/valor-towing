/**
 * All help copy for The Pipeline Math, in one place.
 *
 * Field entries are keyed by field ID. The same entry feeds the inline hint
 * under the field and the "what each question means" section of the help
 * panel, so the two can't drift apart.
 *
 * Voice: a founder talking, not a product. Short common words. No jargon
 * without a plain definition in the same breath.
 */

import type { PipelineResult } from "./types"
import { count, duration, money, percent, perDollar } from "./format"

export const MARKETING_SCAN_URL = "https://starkandbarker.com/#contact"
export const CALENDAR_URL = "https://starkandbarker.com/#contact"

// ---------------------------------------------------------------------------
// Fields
// ---------------------------------------------------------------------------

export interface FieldHelp {
  /** The label the user actually sees. */
  label: string
  /** One sentence, shown inline under the field when expanded. */
  hint: string
  /** Two or three sentences for the help panel. */
  meaning: string
  /** Why it matters to the result. */
  why: string
  /** An example answer. */
  example: string
}

export const fieldHelp: Record<string, FieldHelp> = {
  averageDealSize: {
    label: "What's an average sale worth?",
    hint: "Add up your last ten or so deals and divide by ten. Close is fine.",
    meaning:
      "The dollar value of one typical closed deal. If customers pay you over time, use what they pay in their first twelve months.",
    why: "Almost everything else is figured from this. It turns a count of deals into dollars, and it's half of what a single sales conversation is worth.",
    example: "$12,500",
  },
  salesCycleDays: {
    label: "How long from first conversation to signed deal?",
    hint: "A range is fine, like 30 to 60 days. We'll use the middle.",
    meaning:
      "The time between someone first talking to you and the deal being signed. People call this the sales cycle. It's a range for most businesses, so give one.",
    why: "This is the number that lines up money you spent with the revenue it caused. Without it, every comparison of spend to revenue is comparing the wrong months.",
    example: "30 to 60 days, or 6 weeks",
  },
  closeRate: {
    label: "Of the real sales conversations you have, what share become customers?",
    hint: "If 1 in 4 good conversations turns into a deal, that's 25%.",
    meaning:
      "Out of every real sales conversation, meaning someone who could actually buy, how many end up buying. People call this the close rate.",
    why: "It's what makes a meeting worth a dollar figure. Deal size times close rate is the value of one conversation before you've had it.",
    example: "25%, or 1 in 4",
  },
  revenueType: {
    label: "Is a sale one payment, or do customers keep paying?",
    hint: "Pick the one that's closest. Most businesses are one or the other.",
    meaning:
      "Some businesses sell a thing once. Others sell something customers pay for every month or year. We ask so we can show what a customer is worth over time, not just at signing.",
    why: "If customers keep paying, a single conversation is worth more than the first deal shows. We only show that number if you tell us this.",
    example: "One payment, for a project. Keep paying, for a subscription or retainer.",
  },
  customerLifespanMonths: {
    label: "About how many months does a typical customer stay?",
    hint: "Think about the customers who left. How long had they been with you?",
    meaning:
      "For businesses where customers keep paying: how many months a typical customer stays before leaving. A rough average is fine.",
    why: "It turns your first-year deal size into a whole-customer figure, which is the honest value of one conversation.",
    example: "18 months",
  },
  channelName: {
    label: "Where the money goes",
    hint: "Anything you spend on to bring in customers: ads, events, a person, a partner.",
    meaning:
      "A channel is one place you put marketing money or effort, like Google Ads, LinkedIn, referrals, or trade shows. Add one row per channel. If you only know the total, you can skip the rows and just fill in the total below.",
    why: "Channels are how we work out where your sales come from, and which of them are worth what they cost.",
    example: "Google Ads, Referrals, Trade shows",
  },
  channelSpend: {
    label: "Spend per month",
    hint: "What you pay for this channel in a normal month.",
    meaning: "What you spend on this one channel in a typical month, in dollars.",
    why: "Spend by channel is what lets us show what each customer costs you from each source.",
    example: "$6,000",
  },
  channelLeads: {
    label: "Leads per month from it",
    hint: "People who reached out or booked a call because of this channel. Leave it if you don't know.",
    meaning:
      "How many people each month contact you, fill in a form, or book a call because of this channel. Only count ones you're fairly sure came from here.",
    why: "It lets us show what one conversation costs you from this channel. It's fine not to know. That's a finding in itself.",
    example: "20",
  },
  channelDeals: {
    label: "Deals per month from it",
    hint: "Closed deals you can honestly trace back to this channel.",
    meaning:
      "How many deals close each month that you can trace back to this channel. If you can't tell, leave it. We'll show you how many deals you can't trace, which is often the most useful number here.",
    why: "The gap between deals you can trace and deals you closed is revenue you can't repeat on purpose.",
    example: "4",
  },
  totalMonthlySpend: {
    label: "What do you spend on marketing in a normal month, all in?",
    hint: "Ads, agency fees, tools, and the pay of anyone whose job is marketing.",
    meaning:
      "Everything you spend to bring in customers in a typical month: ad spend, agency or freelancer fees, software, events, and the salary of anyone doing marketing. Most people undercount this by only counting ads.",
    why: "Every cost and return number is figured against this. If it's low, your return looks better than it is.",
    example: "$14,000",
  },
  spendTrend: {
    label: "Has that spend been about the same for the last few months?",
    hint: "If it's moved a lot, the revenue you see now came from a different budget than the one you have now.",
    meaning:
      "Whether your total marketing spend has held steady, gone up, or gone down over roughly the last three months.",
    why: "This month's revenue came from spend a sales cycle ago. If spend has changed since then, your dashboard is comparing this month's revenue to the wrong budget.",
    example: "It's gone up",
  },
  spendThreeMonthsAgo: {
    label: "Roughly what was it three months ago?",
    hint: "A round number is fine.",
    meaning: "Your all-in monthly marketing spend about three months back.",
    why: "It lets us match this month's revenue to the spend that actually caused it.",
    example: "$9,000",
  },
  period: {
    label: "Do you want to answer for a month or a quarter?",
    hint: "Pick whichever is easier to pull. We'll do the converting.",
    meaning: "Whether the next three answers are for one month or for a three-month quarter. We turn everything into monthly numbers behind the scenes.",
    why: "It keeps you from having to divide anything yourself.",
    example: "A month",
  },
  closedDeals: {
    label: "How many deals did you close?",
    hint: "New customers only, not renewals.",
    meaning: "The number of new deals you signed in the period you picked. New customers, not renewals or upsells.",
    why: "It's the number your channels get compared against. The difference is deals you can't trace to a source.",
    example: "14",
  },
  newRevenue: {
    label: "How much new revenue did those deals bring in?",
    hint: "Total value of the deals you just counted, as signed.",
    meaning: "The dollar value of the new deals you closed in that period, as signed, not what has been paid so far.",
    why: "It's the top of every return figure. Revenue divided by spend is what your marketing gave back.",
    example: "$175,000",
  },
  qualifiedMeetings: {
    label: "How many real sales conversations did you have?",
    hint: "Meetings with someone who could actually buy. Skip the tire-kickers.",
    meaning:
      "The number of sales meetings or calls with someone who could actually buy. People call these qualified conversations. Don't count cold outreach that went nowhere.",
    why: "It lets us show what one conversation costs you, and, if you don't know your close rate, work it out from this.",
    example: "56",
  },
  forecastChange: {
    label: "Are you thinking about changing your spend?",
    hint: "Pick what you're actually considering. You can come back and try the others.",
    meaning: "Whether you're considering spending more, spending less, or keeping it where it is.",
    why: "The forecast at the end shows what that choice does over the next few months, with the timing drawn in.",
    example: "Spend more",
  },
  changeAmountPerMonth: {
    label: "By how much per month?",
    hint: "The dollar change to your monthly total, not the new total.",
    meaning: "How many dollars a month you'd add or cut. The change, not the new total.",
    why: "It's what the forecast projects out.",
    example: "$5,000",
  },
  horizonDays: {
    label: "How far out do you want to look?",
    hint: "Longer than your sales cycle, or the forecast won't have time to show the money coming back.",
    meaning: "How many days ahead the forecast should run: 90 or 180.",
    why: "With a long sales cycle, 90 days may end before added spend has had time to pay back. That's not a failure, it's the point.",
    example: "180 days",
  },
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

export interface StepIntro {
  title: string
  /** One sentence: why these questions matter and what they unlock. */
  intro: string
}

export const stepIntros: StepIntro[] = [
  {
    title: "The deal",
    intro: "A few facts about a typical sale. These turn every count into dollars and put the timing on the map.",
  },
  {
    title: "The spend",
    intro: "Where the marketing money goes. This is what your return and your cost per customer get figured against.",
  },
  {
    title: "What you're getting now",
    intro: "The results you see today. Together with the spend, this shows what's coming back and what you can't trace.",
  },
  {
    title: "The question",
    intro: "One thing you're weighing. The forecast at the end will show what it does over the next few months.",
  },
]

// ---------------------------------------------------------------------------
// Results cards
// ---------------------------------------------------------------------------

export interface ResultHelp {
  id: string
  title: string
  /** What the number means. */
  meaning: string
  /** What a good or bad version looks like, using their own figures. Null if not available. */
  forYou: (r: PipelineResult) => string | null
  /** What the number does not mean. */
  notMeaning: string
}

export const resultHelp: ResultHelp[] = [
  {
    id: "assumptions",
    title: "What you don't track",
    meaning:
      "Every number we had to work out, guess, or leave blank because you didn't have it. Each one says what we did about it.",
    forYou: (r) => {
      const missing = r.assumptions.filter((a) => a.kind === "missing").length
      const derived = r.assumptions.filter((a) => a.kind === "derived").length
      if (r.assumptions.length === 0) return "You gave us every number. Nothing here had to be assumed, which is unusual."
      return `For you: ${missing} ${missing === 1 ? "number is" : "numbers are"} missing outright and ${derived} ${derived === 1 ? "was" : "were"} worked out from other answers. The missing ones are the ones worth starting to track.`
    },
    notMeaning: "It's not a grade. Most businesses can't answer all of these. Knowing which ones you can't answer is the useful part.",
  },
  {
    id: "returns",
    title: "What your marketing returned",
    meaning:
      "How many dollars of new revenue came back for each dollar you spent. We show it two ways: the way your dashboard does it, and with the timing lined up.",
    forYou: (r) => {
      if (!r.returns.available || r.returns.naive === null) return null
      const n = r.returns.naive
      const l = r.returns.lagAdjusted
      const base = `For you: ${perDollar(n)} back per dollar the dashboard way`
      if (l === null) return `${base}. Anything over $1.00 means the spend brought back more than it cost, before your other costs.`
      if (r.returns.converge) return `${base}, and about the same with timing lined up. Anything over $1.00 means the spend brought back more than it cost, before your other costs.`
      return `${base}, ${perDollar(l)} with the timing lined up. The second number is the one to trust. Anything over $1.00 means the spend brought back more than it cost, before your other costs.`
    },
    notMeaning:
      "It's not profit. It's revenue back per dollar of marketing, before the cost of delivering the work. And the lined-up version is an estimate built from your sales cycle, not something we measured.",
  },
  {
    id: "attribution",
    title: "Where your sales came from",
    meaning:
      "How many of the deals you closed can be traced back to a channel you listed, and how many can't. The ones you can't trace are revenue you can't repeat on purpose.",
    forYou: (r) => {
      const a = r.attribution
      if (!a.available || a.totalDeals === null) return null
      if (a.reconciles) return "For you: every deal is traced. That's the best version of this number."
      if (a.overReported) return "For you: your channels claim more deals than you closed, so a deal is probably counted twice. Fix that first, then this number means something."
      return `For you: ${count(a.untracedDeals)} of ${count(a.totalDeals)} deals, ${percent(a.untracedShare ?? 0)}, can't be traced. Under 20% is good. Over half means most of your revenue is luck, as far as you can tell.`
    },
    notMeaning:
      "It doesn't mean those deals came from nowhere. They came from somewhere. It means you can't tell where, so you can't do more of it on purpose.",
  },
  {
    id: "costs",
    title: "What a conversation and a customer cost you",
    meaning:
      "Your total spend divided by conversations, and divided by customers. It's what you pay, on average, for one of each. The all-in figure includes money not broken out by channel.",
    forYou: (r) => {
      const c = r.costs.blended
      if (c.costPerDeal === null) return null
      const mv = r.meetingValue.value
      const parts = [`For you: about ${money(c.costPerDeal)} to get one customer`]
      if (c.costPerMeeting !== null) parts.push(`and ${money(c.costPerMeeting)} for one real conversation`)
      let s = parts.join(" ") + "."
      if (mv !== null && c.costPerMeeting !== null) {
        s += mv > c.costPerMeeting ? ` A conversation is worth ${money(mv)} to you, so you're paying less for one than it's worth.` : ` A conversation is worth ${money(mv)} to you, which is less than it costs. Something in the chain needs to change.`
      }
      return s
    },
    notMeaning:
      "It's not what any one channel costs. It's the average across everything. A channel can be far cheaper or dearer than this. The table below shows which, where you gave the numbers.",
  },
  {
    id: "meetingValue",
    title: "What one conversation is worth",
    meaning:
      "Your average deal size times your close rate. It's the dollar value of one real sales conversation before you've had it, because some share of them turn into deals.",
    forYou: (r) => {
      const m = r.meetingValue
      if (!m.available || m.dealSize === null) return null
      if (m.value === null) return `For you: somewhere between ${money(m.atRates[0].value)} and ${money(m.atRates[2].value)}, depending on your close rate, which you don't track yet.`
      return `For you: ${money(m.value)}. That's the most you'd rationally spend to have one more good conversation, before your delivery costs.`
    },
    notMeaning:
      "It's not what a meeting costs, and it's not a price for anything. It's what a conversation is worth to your business. Nobody else's numbers are in it.",
  },
  {
    id: "lever",
    title: "Your biggest lever",
    meaning:
      "We tried a 10% improvement to three things, one at a time: more conversations, a higher close rate, and bigger deals. This shows which one adds the most revenue in your time window.",
    forYou: (r) => {
      if (!r.lever.available) return null
      const top = r.lever.levers.find((l) => l.key === r.lever.top[0])
      if (!top) return null
      return `For you: ${top.label.toLowerCase()} adds about ${money(top.extraRevenue)} over ${r.lever.horizonDays} days. More conversations usually comes in lower over a short window because new deals take ${r.normalized.cycleDays.value !== null ? duration(r.normalized.cycleDays.value) : "a while"} to close.`
    },
    notMeaning:
      "It's not advice on which is easiest to change. Bigger deals may be the biggest lever and also the hardest thing to move. It just says which would pay the most if you could.",
  },
  {
    id: "forecast",
    title: "The next 90 or 180 days",
    meaning:
      "What your spend and revenue look like week by week if you make the change you picked, with the delay between spending and revenue drawn in. The marked point is where the money you put in has come back.",
    forYou: (r) => {
      const f = r.forecast
      if (!f.available) return null
      if (f.change === "hold") return `For you: holding at ${money(r.normalized.monthlySpend.value ?? 0)} a month, about ${money(f.totals.revenue)} comes in over ${f.horizonDays} days if your rates hold.`
      return `For you: ${f.crossoverLabel} The shape of the line matters more than the exact dollars.`
    },
    notMeaning:
      "It's not a prediction. It assumes your close rate, deal size, and return per dollar stay exactly where they are, and that new money works as well as old money. All of those can move.",
  },
]

// ---------------------------------------------------------------------------
// Help panel sections
// ---------------------------------------------------------------------------

export const helpSections = {
  whatThisDoes: {
    title: "What this does, in about a minute",
    paragraphs: [
      "You type in a handful of numbers about your business: what a sale is worth, how long it takes to close, what you spend, and what you're getting back. The app does the arithmetic and shows you what your marketing is actually returning, how much of your revenue you can't trace to a source, and what the next few months look like if you change your spend.",
      "The one thing it does differently from a dashboard is timing. Money you spend today turns into revenue weeks or months later. A dashboard that compares this month's spend to this month's revenue is comparing two unrelated numbers. This app lines them up.",
      "It works only from what you type. It doesn't connect to your accounts, doesn't see your traffic or your spend, and can't check anything you enter. If you guess, the results are built on the guess, and the app will tell you which numbers it had to assume.",
      "Nothing you type leaves your browser except the name, email, and phone you gave at the start.",
    ],
  },
  whatYouNeed: {
    title: "What you'll need before you start",
    intro: "Have these handy and the whole thing takes about four minutes. Guesses are fine. The app shows you exactly which numbers it had to assume, so a rough answer is more useful than a blank.",
    items: [
      { thing: "Your average deal size", where: "Your accounting software, or your last ten invoices added up and divided by ten." },
      { thing: "How long a deal takes to close", where: "Think of your last few customers: when did you first talk, and when did they sign? A range is fine." },
      { thing: "What you spend on marketing each month, all in", where: "Ad accounts, agency invoices, software bills, and the pay of anyone doing marketing. Your bookkeeper has this." },
      { thing: "Spend by channel, if you have it", where: "Each ad platform shows its own monthly spend. Events and agencies are on invoices." },
      { thing: "Deals closed last month or last quarter", where: "Your CRM, or your signed contracts folder." },
      { thing: "New revenue from those deals", where: "Same place. The value as signed." },
      { thing: "Real sales conversations you had", where: "Your calendar or your CRM. Only count meetings with someone who could actually buy." },
      { thing: "Your close rate, if you know it", where: "Deals divided by real conversations. If you don't know it, the app works it out from the two numbers above." },
    ],
  },
  howToUse: {
    title: "How to use it",
    steps: [
      "Enter your name and email to open the app.",
      "Answer the four short screens: the deal, the spend, what you're getting now, and the one change you're weighing.",
      "On any question you don't know, tap \"I don't know\". It counts as a real answer.",
      "Read the results from the top. The first block lists every number we had to assume.",
      "Open \"How is this figured?\" under any number to see the arithmetic in words, using your figures.",
      "Save the scenario with a name, then make a copy and change one number to compare.",
      "Print or save as a PDF to show a partner.",
    ],
  },
  whyTiming: {
    title: "Why the timing matters",
    paragraphs: [
      "Say you spend $10,000 on marketing in January and your deals take about two months to close. The people that money reached in January mostly sign in March. So March's revenue was caused by January's spend.",
      "Now say you raised your spend to $20,000 in March. A dashboard compares March's revenue, which came from the $10,000, to March's spend of $20,000. It tells you your return just got cut in half. Nothing got worse. The dashboard is comparing the wrong months.",
      "It works the other way too. Cut spend in March and the dashboard shows the same revenue against half the spend. Your return looks like it doubled. In May, when the revenue that March should have caused doesn't show up, the dashboard finally catches up, and by then it's easy to blame something else.",
      "This app puts the revenue next to the spend that caused it, using the sales cycle you gave. It's an estimate, since deals don't all close on the same day, so it spreads each month's spend across a window around your cycle length. But it's the right shape, and the dashboard version isn't.",
    ],
  },
  faq: {
    title: "Common questions",
    items: [
      {
        q: "Is my data stored anywhere?",
        a: "No. The numbers stay in your browser. Saved scenarios live in your browser's own storage on this device. The only thing sent to us is the name, email, and phone you typed at the start, and that's only because we asked for it.",
      },
      {
        q: "What if I don't know a number?",
        a: "Tap \"I don't know\". The app either works it out from your other answers and says so, uses a clearly marked estimate you can change, or leaves that one result out and tells you which number would bring it back. The list of numbers you don't track is one of the results.",
      },
      {
        q: "Can I change my answers?",
        a: "Yes. Use \"Change my answers\" at the top of the results, or the back button in the questions. Nothing you typed is lost.",
      },
      {
        q: "Can I compare two scenarios?",
        a: "Yes. Save the current one with a name, then choose \"Make a copy\", change a number, and save that too. Switch between them from the saved list.",
      },
      {
        q: "How accurate is the projection?",
        a: "It's as accurate as the assumption that nothing changes: your close rate, deal size, and return per dollar all hold, and new money performs like old money. Those often don't hold, in either direction. Treat the shape of the line as real and the exact dollars as a guide.",
      },
      {
        q: "Why does it ask whether my spend has been steady?",
        a: "Because this month's revenue came from spend a sales cycle ago. If your spend has moved since then, matching revenue to the spend that caused it changes the answer. If it's been steady, the two versions of your return come out the same, and the app says so.",
      },
      {
        q: "Does this work for a business with short sales cycles?",
        a: "Yes, and it'll tell you the timing isn't hiding anything from you. That's still useful to know.",
      },
    ],
  },
  whoBuiltThis: {
    title: "Who built this",
    paragraphs: [
      "Stark & Barker, a solo marketing agency for B2B companies. Clients kept asking some version of the same question: what is this spend actually giving me back? Their dashboards couldn't answer it honestly, so this is the arithmetic written out.",
      "If you'd like someone to look at your real numbers with you, the free Marketing Scan is a short call where we do exactly that. No pitch on the call.",
    ],
  },
}
