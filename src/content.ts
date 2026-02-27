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
    id: "c45",
    name: "C45 Agency",
    role: "Founder",
    status: "past" as const,
    description: "Full-service marketing agency helping brands grow through strategy, content, and paid media.",
    link: null,
    action: "none" as const,
  },
  {
    id: "realestate",
    name: "Wallace Real Estate",
    role: "Founder",
    status: "past" as const,
    description: "Built a tech-forward real estate team starting at 18 years old. Early lesson in systems and scale.",
    link: null,
    action: "none" as const,
  },
];

export const TOOLS_TEMPLATES = [
  {
    name: "ceo-operating-system.notion",
    desc: "Complete Notion workspace for the faith-driven CEO — weekly planning, client tracking, goals, decisions.",
    tag: "productivity",
  },
  {
    name: "growth-framework.notion",
    desc: "Guided template built around the six pillars — God-Sized Vision through Healthy Habits.",
    tag: "strategy",
  },
  {
    name: "client-relationship-vault.notion",
    desc: "Track every client touchpoint, meeting note, and action item. Nothing falls through the cracks.",
    tag: "client ops",
  },
  {
    name: "ai-agent-memory-system.notion",
    desc: "Build a second brain that never forgets — long-term memory, context logs, and decision history for AI-assisted operators.",
    tag: "ai",
  },
  {
    name: "social-media-manager.notion",
    desc: "Content calendar, post drafts, platform strategy, and analytics tracking all in one Notion workspace.",
    tag: "marketing",
  },
  {
    name: "sop-database.notion",
    desc: "Document every repeatable process in your business. SOPs your team can actually follow and your company can scale on.",
    tag: "operations",
  },
];

export const TOOLS_TECH = [
  { name: "Notion",            desc: "My default operating system. Brain, CRM, docs.",                          url: "https://notion.so",               logo: "https://logo.clearbit.com/notion.so",          color: "#191919", category: "productivity" },
  { name: "HubSpot",           desc: "CRM and marketing automation for scaling client pipelines.",               url: "https://hubspot.com",              logo: "https://logo.clearbit.com/hubspot.com",         color: "#ff7a59", category: "crm" },
  { name: "Cursor",            desc: "AI-powered code editor. How I build and iterate fast.",                   url: "https://cursor.com",              logo: "https://logo.clearbit.com/cursor.com",          color: "#1a1a2e", category: "dev" },
  { name: "Claude",            desc: "Anthropic's AI — powers Mr. Wallace and my core AI workflows.",           url: "https://claude.ai",                logo: "https://logo.clearbit.com/anthropic.com",      color: "#c96a2a", category: "ai" },
  { name: "OpenAI",            desc: "GPT-4o for content generation and research tasks.",                       url: "https://openai.com",               logo: "https://logo.clearbit.com/openai.com",          color: "#10a37f", category: "ai" },
  { name: "n8n",               desc: "Self-hosted automation. More powerful than Zapier for complex flows.",    url: "https://n8n.io",                   logo: "https://logo.clearbit.com/n8n.io",              color: "#ea4b71", category: "automation" },
  { name: "Loom",              desc: "Async video for client communication and training.",                       url: "https://loom.com",                 logo: "https://logo.clearbit.com/loom.com",            color: "#625df5", category: "comms" },
  { name: "Grain",             desc: "AI meeting notes — I don't take manual call notes anymore.",              url: "https://grain.com",                logo: "https://logo.clearbit.com/grain.com",           color: "#2563eb", category: "meetings" },
  { name: "Slack",             desc: "Team communication for FBF ops.",                                         url: "https://slack.com",                logo: "https://logo.clearbit.com/slack.com",           color: "#4a154b", category: "comms" },
  { name: "Google Workspace",  desc: "Calendar, Drive, Gmail. The foundation everything runs on.",              url: "https://workspace.google.com",     logo: "https://logo.clearbit.com/google.com",          color: "#4285f4", category: "productivity" },
  { name: "Zapier",            desc: "Automation glue between tools. Fast to set up, easy to maintain.",        url: "https://zapier.com",               logo: "https://logo.clearbit.com/zapier.com",          color: "#ff4f00", category: "automation" },
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
