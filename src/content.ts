// ─────────────────────────────────────────────────────────────────────────────
// CONTENT.TS — Edit your site text here
// Changes here automatically update the site. Save the file and refresh.
// ─────────────────────────────────────────────────────────────────────────────

export const HERO = {
  tagline: "CEO Mentor & Strategic Architect",
  description:
    "Helping founders & leaders scale 7–8 figure companies without compromising on their faith, family, or finances.",
  ctaPrimary: "Work With Us",
  ctaSecondary: "Browse Tools",
};

export const ABOUT = {
  headline: "I help faith-driven founders scale to 7–8 figures without losing what matters most.",
  bio1: `As CEO Mentor and Strategic Architect at Fueled By Fire, I walk alongside Kingdom-minded
entrepreneurs building companies God's way.`,
  bio2: `I work alongside my parents Larry & Staci Wallace, who founded FBF to reflect heaven on earth in the marketplace.`,
  bio3: `My framework is simple: build the business God's way, grow it without compromise, and use it as a tool for something eternal.`,
  quote: `"Outside of work: porsche fanatic, 5am pickleball, travel, and building mr. wallace."`,
};

export const PORTFOLIO = [
  {
    id: "fbf",
    name: "Fueled By Fire",
    role: "CEO Mentor & Strategic Architect",
    status: "current" as const,
    description: "Helping Kingdom-minded entrepreneurs scale to 7–8 figures through the G.R.O.W.T.H. framework.",
    link: "https://fbfchallenge.com",
    action: "growth" as const, // triggers the GROWTH animation
    logo: "/images/fbf-logo.png",
  },
  {
    id: "epiphany",
    name: "Epiphany Global",
    role: "Contributor & Advocate",
    status: "current" as const,
    description: "Isaiah 58 in action — funding the Epiphany Gathering Place in Gulu, Uganda.",
    link: "https://donorbox.org/epiphany-global",
    action: "link" as const,
  },
  {
    id: "epiphanyranch",
    name: "Epiphany Ranch",
    role: "Steward",
    status: "current" as const,
    description: "Stewarding land as mission — a place of rest, restoration, and Kingdom purpose.",
    link: "https://instagram.com/epiphanyranch",
    action: "link" as const,
  },
  {
    id: "past",
    name: "Past Experience",
    role: "Founder",
    status: "past" as const,
    description: "Founded C45 Agency (full-service marketing) and Wallace Real Estate Team starting at 18. Early lessons in systems, scale, and building teams.",
    link: null,
    action: "none" as const,
  },
];

export const TOOLS_TEMPLATES = [
  {
    id: "ceo-operating-system",
    name: "CEO Operating System",
    filename: "ceo-operating-system.notion",
    tag: "productivity",
    desc: "Complete Notion workspace for the faith-driven CEO — weekly planning, 90-day goals, G.R.O.W.T.H. pulse checks, decision log, and relationship tracking.",
    features: [
      "Weekly operating rhythm (Monday set / Friday close)",
      "90-day goal tracker with success criteria",
      "Monthly G.R.O.W.T.H. pillar pulse check",
      "Decision log — every major call, documented",
      "Inner circle and client relationship map",
      "Reading list and current focus tracker",
    ],
    purchaseLink: null as string | null,
    images: [] as string[],
  },
  {
    id: "growth-framework",
    name: "G.R.O.W.T.H. Framework",
    filename: "growth-framework.notion",
    tag: "strategy",
    desc: "A full diagnostic and planning workspace built around the six pillars — from God-Sized Vision to Healthy Habits. Built for founders who want to scale the right way.",
    features: [
      "Deep-dive section for all 6 pillars",
      "Clarity questions and honest audit prompts",
      "Know-your-numbers tracker (MRR, profit margin, CAC)",
      "Wise counsel advisory board mapping",
      "Time audit framework",
      "Quarterly G.R.O.W.T.H. review and scoring",
    ],
    purchaseLink: null as string | null,
    images: [] as string[],
  },
  {
    id: "client-relationship-vault",
    name: "Client Relationship Vault",
    filename: "client-relationship-vault.notion",
    tag: "client ops",
    desc: "Track every client touchpoint, meeting note, and action item. Built around the Freezer Framework — nothing falls through the cracks.",
    features: [
      "Client database with health scores and renewal dates",
      "Full Freezer Framework meeting note template",
      "Follow-up email structure (already written for you)",
      "Post-call action item tracker",
      "Relationship health indicators (green / yellow / red)",
      "VIP client notes section",
    ],
    purchaseLink: null as string | null,
    images: [] as string[],
  },
  {
    id: "ai-agent-memory-system",
    name: "AI Agent Memory System",
    filename: "ai-agent-memory-system.notion",
    tag: "ai",
    desc: "Build a second brain for your AI agent that never forgets. SOUL, USER, and MEMORY files — structured so your agent always has the context it needs.",
    features: [
      "SOUL.md — agent identity, voice, and decision rules",
      "USER.md — everything your agent needs to know about you",
      "MEMORY.md — long-term context, decisions, lessons",
      "Daily log system with end-of-day summary protocol",
      "Prompt library organized by use case",
      "Agent architecture map for multi-agent setups",
    ],
    purchaseLink: null as string | null,
    images: [] as string[],
  },
  {
    id: "social-media-manager",
    name: "Social Media Manager",
    filename: "social-media-manager.notion",
    tag: "marketing",
    desc: "Content calendar, brand voice guide, platform strategy, and 10 proven hooks — everything you need to show up consistently without burning out.",
    features: [
      "Brand voice guide and content pillars",
      "Content calendar with status tracking",
      "10 hooks that actually drive engagement",
      "Platform strategy by channel (Instagram, LinkedIn, Email)",
      "Post anatomy framework",
      "Monthly analytics review template",
    ],
    purchaseLink: null as string | null,
    images: [] as string[],
  },
  {
    id: "sop-database",
    name: "SOP Database",
    filename: "sop-database.notion",
    tag: "operations",
    desc: "Document every repeatable process in your business. SOPs your team can actually follow — and your company can scale without you in every room.",
    features: [
      "SOP database with owner, status, and priority fields",
      "Standard SOP page template (pre-structured)",
      "Priority SOP checklist across all departments",
      "Team ownership map",
      "Quarterly SOP review schedule",
      "Error-capture and update protocol",
    ],
    purchaseLink: null as string | null,
    images: [] as string[],
  },
];

export const TOOLS_TECH = [
  { name: "Notion",           desc: "My default operating system. Brain, CRM, docs, and template vault.",       url: "https://notion.so",            logo: "https://logo.clearbit.com/notion.so",       color: "#191919", category: "productivity" },
  { name: "Claude",           desc: "Anthropic's AI — powers Mr. Wallace and my core AI workflows.",            url: "https://claude.ai",            logo: "https://logo.clearbit.com/anthropic.com",   color: "#c96a2a", category: "ai" },
  { name: "Cursor",           desc: "AI-powered code editor. How I build and ship fast without a dev team.",    url: "https://cursor.com",           logo: "https://logo.clearbit.com/cursor.com",      color: "#1a1a2e", category: "dev" },
  { name: "Next.js",          desc: "The framework this site is built on. Fast, flexible, and deploys in seconds.", url: "https://nextjs.org",       logo: "https://logo.clearbit.com/nextjs.org",      color: "#000000", category: "dev" },
  { name: "Vercel",           desc: "Zero-config hosting. Deploy from terminal, live in 60 seconds.",           url: "https://vercel.com",           logo: "https://logo.clearbit.com/vercel.com",      color: "#000000", category: "dev" },
  { name: "HubSpot",          desc: "CRM and marketing automation for scaling client pipelines.",                url: "https://hubspot.com",          logo: "https://logo.clearbit.com/hubspot.com",     color: "#ff7a59", category: "crm" },
  { name: "Grain",            desc: "AI meeting notes — I don't take manual call notes anymore.",               url: "https://grain.com",            logo: "https://logo.clearbit.com/grain.com",       color: "#2563eb", category: "meetings" },
  { name: "Loom",             desc: "Async video for client communication, training, and walkthroughs.",        url: "https://loom.com",             logo: "https://logo.clearbit.com/loom.com",        color: "#625df5", category: "comms" },
  { name: "Google Workspace", desc: "Calendar, Drive, Gmail. The foundation everything runs on.",               url: "https://workspace.google.com", logo: "https://logo.clearbit.com/google.com",      color: "#4285f4", category: "productivity" },
  { name: "Slack",            desc: "Team communication for FBF ops and client channels.",                      url: "https://slack.com",            logo: "https://logo.clearbit.com/slack.com",       color: "#4a154b", category: "comms" },
  { name: "n8n",              desc: "Self-hosted automation. More powerful than Zapier for complex workflows.",  url: "https://n8n.io",               logo: "https://logo.clearbit.com/n8n.io",          color: "#ea4b71", category: "automation" },
  { name: "Zapier",           desc: "Automation glue between tools. Fast to set up, easy to maintain.",         url: "https://zapier.com",           logo: "https://logo.clearbit.com/zapier.com",      color: "#ff4f00", category: "automation" },
  { name: "Framer Motion",    desc: "Animation library. Every transition and motion effect on this site.",      url: "https://framer.com/motion",    logo: "https://logo.clearbit.com/framer.com",      color: "#0055ff", category: "dev" },
  { name: "Resend",           desc: "Transactional email. Powers the contact form and template waitlist.",      url: "https://resend.com",           logo: "https://logo.clearbit.com/resend.com",      color: "#000000", category: "dev" },
  { name: "OpenAI",           desc: "GPT-4o for content generation, research, and AI workflow tasks.",          url: "https://openai.com",           logo: "https://logo.clearbit.com/openai.com",      color: "#10a37f", category: "ai" },
];

export const TOOLS_BOOKS = [
  { title: "The Score Takes Care of Itself",        author: "Bill Walsh",         link: "https://www.amazon.com/dp/1591843472" },
  { title: "How to Win Friends & Influence People", author: "Dale Carnegie",      link: "https://www.amazon.com/dp/0671027034" },
  { title: "Building a StoryBrand",                 author: "Donald Miller",      link: "https://www.amazon.com/dp/0718033329" },
  { title: "Unreasonable Hospitality",              author: "Will Guidara",       link: "https://www.amazon.com/dp/0593418573" },
  { title: "Mere Christianity",                     author: "C.S. Lewis",         link: "https://www.amazon.com/dp/0060652926" },
  { title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", link: "https://www.amazon.com/dp/1982137274" },
];

export const GENEROSITY = {
  headline: "Why we build profitable businesses.",
  body1: `Building a profitable business is not the goal. It's the mechanism.`,
  body2: `Most founders chase success as a destination — the exit, the revenue milestone, the recognition. But the Kingdom-minded entrepreneur understands something different: your company is a machine of generosity. You build it profitable not for personal accumulation, but to fuel something eternal.`,
  body3: `Isaiah 58 is the blueprint. The call isn't passive charity — it's structural generosity. Break the yoke. Share your bread. Rebuild the ancient ruins. The businesses we build should do the same.`,
  body4: `Your profit margin is someone's clean water. Your growth is a school. Your scale is the capacity to answer the call.`,
};

export const CONNECT = {
  instagramHandle: "@paytoncwallace",
  instagramUrl: "https://instagram.com/paytoncwallace",
  instagramNote: "most active — behind the scenes",
};

export const CHAT_SYSTEM_PROMPT = `You are a helpful assistant on Payton Wallace's personal website (paytonwallace.com).
You can ONLY answer questions about the following topics:
- Payton Wallace — CEO Mentor & Strategic Architect at Fueled By Fire, based in Dallas TX
- G.R.O.W.T.H. framework (God-Sized Vision, Revenue vs. Profit, Operational Authority, Wise Counsel, Time Management, Healthy Habits)
- Fueled By Fire (fbfchallenge.com) — mentoring faith-driven founders to scale to 7-8 figures
- Epiphany Global — missions work, Epiphany Gathering Place in Gulu Uganda, donorbox.org/epiphany-global
- C45 Agency — past marketing agency Payton founded
- Wallace Real Estate Team — Payton started in real estate at 18, built a tech-forward team
- Notion templates on this site (CEO Operating System, GROWTH Framework, Client Relationship Vault)
- Recommended tech stack (Notion, HubSpot, Framer/Next.js, Loom, Grain, Slack, Google Workspace, Zapier)
- Recommended books (The Score Takes Care of Itself, Traction, Buy Back Your Time, Unreasonable Hospitality, The Gap and the Gain, God and Money)
- How to work with Payton or connect with him (via Instagram @paytoncwallace or the contact form on the site)

If asked anything outside these topics, politely say you can only answer questions about what's on this site.
Keep answers concise (2-4 sentences max). Friendly, direct tone.`;
