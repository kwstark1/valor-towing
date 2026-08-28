/**
 * Major G's Texas-Style BBQ — single source of truth for editable content.
 *
 * NUMBERS POLICY: every figure below that the client hasn't confirmed yet is a
 * PLACEHOLDER set to a competitor-informed average (Goldee's, Carolina Moe's,
 * Snake River Farms, Franklin-tier market rates). They are intentionally easy to
 * change — edit here and the whole funnel updates. Items marked HARD GATE must be
 * replaced with real values before launch (see the spec's Asset Readiness block).
 *
 * MODEL: local DELIVERY (no pickup location). Orders are requested on-site, then
 * confirmed by call; brisket is delivered fresh on the weekly delivery day.
 */

export const majorGs = {
  brand: "Major G's",
  tagline: "Texas-Style BBQ Brisket",

  // --- Contact (HARD GATE — placeholders, replace before launch) ---
  // 910 = Onslow County, NC. 555-01xx is the reserved fictitious range, so this
  // number is obviously a placeholder until the real line is set.
  phone: "(910) 555-0147",
  phoneHref: "tel:+19105550147",
  ordersEmail: "orders@majorgsbbq.com",

  // --- Service area (delivery zone — no public pickup address) ---
  city: "Richlands, NC",
  county: "Onslow County",
  deliveryArea: "Richlands, Jacksonville, Swansboro & nearby Onslow County",

  // --- Pricing (PLACEHOLDER — competitor average for cooked, sliced brisket) ---
  // Cooked Texas brisket by the pound runs ~$24–31/lb across reference brands;
  // ~$28 is the working average. Wholesale ~20% off retail.
  pricePerLb: 27.99,
  wholesalePricePerLb: 21.99,
  minOrderLbs: 1,

  // --- Delivery (PLACEHOLDER — typical local food-delivery economics) ---
  deliveryFee: 7.99,
  freeDeliveryOver: 75,

  // Allowed delivery ZIPs — enforced on the order form AND the API. These are real
  // Onslow County, NC ZIPs for the named towns + nearby; CONFIRM the real radius
  // with the client and edit this list to expand or limit the area.
  deliveryZips: [
    "28574", // Richlands
    "28540", "28546", // Jacksonville
    "28543", "28544", "28545", "28547", // Jacksonville (Camp Lejeune / MCAS area)
    "28584", // Swansboro
    "28539", // Hubert
    "28460", // Sneads Ferry
    "28445", // Holly Ridge
    "28454", // Maple Hill
    "28582", // Stella
    "28555", // Maysville
  ] as string[],

  // --- Weekly batch / scarcity (PLACEHOLDER — single-smoker capacity estimate) ---
  weeklyBatchLbs: 120,
  lbsRemaining: 45, // updated weekly; falls back to evergreen copy when stale (see below)
  orderByDay: "Wednesday",
  deliveryDay: "Friday",

  // --- Reviews cold-start ---
  // Live Google widget stays hidden until the count crosses this threshold;
  // founder-collected quote cards show meanwhile (see reviews[] below).
  reviewThreshold: 12,
  currentReviewCount: 0, // set to real Google/FB count; >= threshold flips on the widget
  googleReviewsUrl: "", // paste Google Business Profile reviews URL when live

  // --- Volatile availability copy ---
  // If `lbsRemaining`/dates aren't kept current, render the evergreen fallback so a
  // stale date never shows.
  availabilityIsCurrent: true,
} as const

/** Reduce any ZIP input to its first 5 digits (handles "28540-1234", spaces, etc.). */
export function normalizeZip(zip: string): string {
  return (zip.match(/\d/g) || []).join("").slice(0, 5)
}

/** True if the ZIP is inside the delivery area. Used by the form and the API. */
export function isInDeliveryArea(zip: string): boolean {
  return majorGs.deliveryZips.includes(normalizeZip(zip))
}

export const NAV_LINKS = [
  { label: "Order", href: "#product" },
  { label: "Our Story", href: "#founder" },
  // "Why Us" until the live reviews widget is up; rename to "Reviews" once live.
  { label: majorGs.currentReviewCount >= majorGs.reviewThreshold ? "Reviews" : "Why Us", href: "#social-proof" },
  { label: "Wholesale", href: "#wholesale" },
  { label: "Contact", href: "#footer" },
] as const

export const TRUST_BADGES = [
  { title: "Texas-Style Craft", copy: "Real wood smoke. Real technique." },
  { title: "Local Delivery", copy: "Brought fresh to your door." },
  { title: "Never Frozen", copy: "Fresh-sliced every batch." },
  { title: "Bulk Pricing", copy: "Families, businesses & events welcome." },
] as const

export const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Choose Your Pounds",
    copy: "Tell us how much brisket you need and your delivery date — no payment up front.",
  },
  {
    step: "2",
    title: "We Smoke It Fresh",
    copy: "Low and slow over real wood, 12+ hours, the Texas way. Never frozen.",
  },
  {
    step: "3",
    title: "We Deliver It Fresh",
    copy: `Brought straight to your door across ${majorGs.deliveryArea}, fresh-sliced. We call to confirm before we head out.`,
  },
] as const

export const FAQS = [
  {
    q: "Is there a minimum order?",
    a: `Yes — a ${majorGs.minOrderLbs} lb minimum. Order as much as you need beyond that; bulk and event pricing kicks in on larger orders.`,
  },
  {
    q: "Where do you deliver, and is there a fee?",
    a: `We deliver across ${majorGs.deliveryArea}. Delivery is $${majorGs.deliveryFee.toFixed(2)} — free on orders over $${majorGs.freeDeliveryOver}. Enter your ZIP when you order and we'll tell you instantly whether you're in range.`,
  },
  {
    q: "How far ahead do I need to order?",
    a: `We smoke in weekly batches. Order by ${majorGs.orderByDay} to lock in ${majorGs.deliveryDay} delivery. Popular weeks sell out, so earlier is safer.`,
  },
  {
    q: "Can you handle a large event or my business?",
    a: "Absolutely. Cookouts, caterers, restaurants and food trucks — tell us your weekly poundage and we'll set you up. See the wholesale section below.",
  },
  {
    q: "Is the brisket fresh or frozen?",
    a: "Always fresh, never frozen. Every order is sliced the day it's delivered.",
  },
] as const

/**
 * Founder-collected quote cards (the launch fallback for the reviews widget).
 * PLACEHOLDER copy so the section can be previewed — DO NOT ship these as if they
 * were real customer reviews. Replace with genuine quotes you collect (text first
 * customers, an insert card in the delivery, follow-up email), or set to [] to hide
 * the cards until you have real ones. The live Google widget replaces these once
 * `currentReviewCount` >= `reviewThreshold`.
 */
export const reviews: { quote: string; name: string; placeholder?: boolean }[] = [
  {
    quote: "Best brisket I've had outside of Texas. The bark and smoke ring are the real deal.",
    name: "Sample — replace before launch",
    placeholder: true,
  },
  {
    quote: "Ordered 5 lbs for a family cookout and everyone asked where I got it. Delivery was right on time.",
    name: "Sample — replace before launch",
    placeholder: true,
  },
  {
    quote: "Fresh-sliced, still warm, fell-apart tender — brought right to my door. We're regulars now.",
    name: "Sample — replace before launch",
    placeholder: true,
  },
]

export const ORDER_PRODUCTS = [
  { value: "sliced", label: "Sliced brisket (by the lb)" },
  { value: "whole", label: "Whole packer brisket" },
  { value: "both", label: "Some of both" },
] as const

export const ORDER_LBS = ["1 lb", "2 lbs", "3 lbs", "5 lbs", "10 lbs", "10+ lbs (event / bulk)"] as const
