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
  // productivity
  { name: "Notion",           desc: "My default operating system. Brain, CRM, docs, and template vault.",                                             url: "https://notion.so",                  logo: "https://logo.clearbit.com/notion.so",       color: "#191919", category: "productivity" },
  { name: "Google Workspace", desc: "Calendar, Drive, Gmail. The foundation everything runs on.",                                                     url: "https://workspace.google.com",       logo: "https://logo.clearbit.com/google.com",      color: "#4285f4", category: "productivity" },
  // ai
  { name: "Claude",           desc: "Anthropic's AI — powers Mr. Wallace and my core AI workflows.",                                                  url: "https://claude.ai",                  logo: "https://logo.clearbit.com/anthropic.com",   color: "#c96a2a", category: "ai" },
  { name: "Notion AI",        desc: "AI built directly into Notion — summarize notes, generate drafts, and edit right inside your workspace.",        url: "https://notion.so/product/ai",       logo: "https://logo.clearbit.com/notion.so",       color: "#191919", category: "ai" },
  { name: "OpenAI",           desc: "GPT-4o for content generation, research, and AI workflow tasks.",                                                url: "https://openai.com",                 logo: "https://logo.clearbit.com/openai.com",      color: "#10a37f", category: "ai" },
  // dev
  { name: "Cursor",           desc: "AI-powered code editor. How I build and ship fast without a dev team.",                                          url: "https://cursor.com",                 logo: "https://logo.clearbit.com/cursor.com",      color: "#1a1a2e", category: "dev" },
  { name: "Next.js",          desc: "The framework this site is built on. Fast, flexible, and deploys in seconds.",                                   url: "https://nextjs.org",                 logo: "https://logo.clearbit.com/nextjs.org",      color: "#000000", category: "dev" },
  { name: "Vercel",           desc: "Zero-config hosting. Deploy from terminal, live in 60 seconds.",                                                 url: "https://vercel.com",                 logo: "https://logo.clearbit.com/vercel.com",      color: "#000000", category: "dev" },
  { name: "Framer Motion",    desc: "Animation library. Every transition and motion effect on this site.",                                            url: "https://framer.com/motion",          logo: "https://logo.clearbit.com/framer.com",      color: "#0055ff", category: "dev" },
  { name: "Resend",           desc: "Transactional email. Powers the contact form and template waitlist.",                                            url: "https://resend.com",                 logo: "https://logo.clearbit.com/resend.com",      color: "#000000", category: "dev" },
  // crm
  { name: "Attio",            desc: "Modern CRM built for relationship-driven businesses. Replaces spreadsheets with structure that actually scales.", url: "https://attio.com",                  logo: "https://logo.clearbit.com/attio.com",       color: "#111827", category: "crm" },
  { name: "Notion",           desc: "Client relationship tracking, deal pipelines, and CRM dashboards — all inside Notion.",                          url: "https://notion.so",                  logo: "https://logo.clearbit.com/notion.so",       color: "#191919", category: "crm" },
  { name: "Klaviyo",          desc: "Email and SMS marketing automation built for scaling retention and revenue at every stage of growth.",            url: "https://klaviyo.com",                logo: "https://logo.clearbit.com/klaviyo.com",     color: "#1a1a1a", category: "crm" },
  // meetings
  { name: "Grain",            desc: "AI meeting notes — I don't take manual call notes anymore.",                                                     url: "https://grain.com",                  logo: "https://logo.clearbit.com/grain.com",       color: "#2563eb", category: "meetings" },
  { name: "Zoom",             desc: "Video meetings for client sessions, coaching calls, and team standups.",                                         url: "https://zoom.us",                    logo: "https://logo.clearbit.com/zoom.us",         color: "#2D8CFF", category: "meetings" },
  { name: "Notion Calendar",  desc: "Calendar that connects directly to Notion so your schedule and your work live in the same place.",               url: "https://notion.so/product/calendar", logo: "https://logo.clearbit.com/notion.so",       color: "#191919", category: "meetings" },
  // comms
  { name: "Loom",             desc: "Async video for client communication, training, and walkthroughs.",                                              url: "https://loom.com",                   logo: "https://logo.clearbit.com/loom.com",        color: "#625df5", category: "comms" },
  { name: "Slack",            desc: "Team communication for FBF ops and client channels.",                                                            url: "https://slack.com",                  logo: "https://logo.clearbit.com/slack.com",       color: "#4a154b", category: "comms" },
  // automation
  { name: "n8n",              desc: "Self-hosted automation. More powerful than Zapier for complex workflows.",                                        url: "https://n8n.io",                     logo: "https://logo.clearbit.com/n8n.io",          color: "#ea4b71", category: "automation" },
  { name: "Zapier",           desc: "Automation glue between tools. Fast to set up, easy to maintain.",                                               url: "https://zapier.com",                 logo: "https://logo.clearbit.com/zapier.com",      color: "#ff4f00", category: "automation" },
];

export const TOOLS_BOOKS = [
  // business
  { title: "The Score Takes Care of Itself",         author: "Bill Walsh",                    link: "https://www.amazon.com/dp/1591843472",          category: "business",       desc: "Bill Walsh's philosophy on building a culture of excellence drawn from coaching the 49ers. Standards — not wins — are what separate elite organizations." },
  { title: "Good to Great",                          author: "Jim Collins",                   link: "https://www.amazon.com/dp/0066620996",          category: "business",       desc: "Collins' research on what separates good companies from truly great ones. Disciplined people, disciplined thought, and disciplined action are the through-lines." },
  { title: "Built to Last",                          author: "Jim Collins",                   link: "https://www.amazon.com/dp/0060516402",          category: "business",       desc: "A study of the foundational habits that let visionary companies outlast every trend. The goal isn't to be great — it's to be built to last." },
  { title: "Shoe Dog",                               author: "Phil Knight",                   link: "https://www.amazon.com/dp/1501135929",          category: "business",       desc: "Phil Knight's raw memoir of building Nike from a $50 handshake deal to a global brand. A story about obsession, risk, and the cost of building something real." },
  { title: "Profit First",                           author: "Mike Michalowicz",              link: "https://www.amazon.com/dp/073521414X",          category: "business",       desc: "Michalowicz's system for making profit a structural habit, not an afterthought. Flip the accounting formula and your business starts building wealth from day one." },
  { title: "10x Is Easier Than 2x",                 author: "Dan Sullivan & Dr. Benjamin Hardy", link: "https://www.amazon.com/dp/140196995X",     category: "business",       desc: "The argument that 10x thinking actually requires less effort than incremental improvement. The constraint isn't capacity — it's the lens you're using." },
  { title: "Building a StoryBrand",                 author: "Donald Miller",                 link: "https://www.amazon.com/dp/0718033329",          category: "business",       desc: "Miller's framework for clarifying your message so customers can actually hear it. Your customer is the hero; your job is to be the guide." },
  { title: "The Go-Giver",                           author: "Bob Burg",                      link: "https://www.amazon.com/dp/1591842433",          category: "business",       desc: "A short parable about shifting from a go-getter mindset to a go-giver one. The five laws of stratospheric success are about what you give, not what you get." },
  { title: "Tribes",                                 author: "Seth Godin",                    link: "https://www.amazon.com/dp/1591842336",          category: "business",       desc: "How leaders create movements by connecting people around a shared idea. You don't need everyone — just the right people and a cause worth rallying around." },
  { title: "Purple Cow",                             author: "Seth Godin",                    link: "https://www.amazon.com/dp/1591843170",          category: "business",       desc: "Godin's case for building something remarkable rather than marketing something ordinary. Safe is the riskiest strategy; remarkable is the only one worth pursuing." },
  { title: "Contagious",                             author: "Jonah Berger",                  link: "https://www.amazon.com/dp/1451686579",          category: "business",       desc: "Berger's research on why certain ideas, products, and businesses spread while others don't. Six STEPPS explain what drives word-of-mouth — and they're all in your control." },
  { title: "Think and Grow Rich",                    author: "Napoleon Hill",                 link: "https://www.amazon.com/dp/0449214923",          category: "business",       desc: "Napoleon Hill's classic on the mindset and habits of people who achieve extraordinary results. Desire, faith, and persistence are the foundational levers." },
  { title: "Unreasonable Hospitality",               author: "Will Guidara",                  link: "https://www.amazon.com/dp/0593418573",          category: "business",       desc: "Guidara on making people feel seen, known, and valued in every single interaction. The standard he set at Eleven Madison Park applies to every business at every price point." },
  { title: "The Janitor",                            author: "Todd Hopkins & Ray Hilbert",    link: "https://www.amazon.com/dp/0470096543",          category: "business",       desc: "A leadership parable about servant leadership and finding dignity in every role. How you treat people when no one's watching defines your actual character." },
  // leadership
  { title: "Lincoln on Leadership",                  author: "Donald T. Phillips",            link: "https://www.amazon.com/dp/0446394599",          category: "leadership",     desc: "Phillips extracts timeless leadership principles from Abraham Lincoln's presidency. Lessons in communication, character, and leading under pressure that map directly to business." },
  { title: "Developing the Leader Within You",       author: "John C. Maxwell",               link: "https://www.amazon.com/dp/0785281126",          category: "leadership",     desc: "Maxwell's foundational guide to building leadership from the inside out. Influence — not position — is what makes a real leader." },
  { title: "Winning with People",                    author: "John C. Maxwell",               link: "https://www.amazon.com/dp/0785260897",          category: "leadership",     desc: "Maxwell's playbook on the relationship principles that determine success or failure. People skills are the multiplier on every other skill you have." },
  { title: "Talent Is Never Enough",                 author: "John C. Maxwell",               link: "https://www.amazon.com/dp/0785289356",          category: "leadership",     desc: "Maxwell's case for why talent without the right choices leads nowhere long-term. Thirteen decisions separate talented people from those who actually win." },
  { title: "Born to Win",                            author: "Zig Ziglar",                    link: "https://www.amazon.com/dp/0937539783",          category: "leadership",     desc: "Ziglar on designing a life of purpose, performance, and intentional success. Practical, faith-grounded, and straight to the point on what it takes to win long-term." },
  { title: "How Full Is Your Bucket?",               author: "Tom Rath & Donald Clifton",     link: "https://www.amazon.com/dp/1595620036",          category: "leadership",     desc: "The science behind positive interactions and their compounding effect on performance and well-being. Every conversation either adds to or drains someone's bucket — including yours." },
  { title: "How to Win Friends & Influence People",  author: "Dale Carnegie",                 link: "https://www.amazon.com/dp/0671027034",          category: "leadership",     desc: "Carnegie's classic on human relations that has stood the test of time since 1936. The fundamentals of influence have not changed — most people just never practice them." },
  { title: "The Art of War",                         author: "Sun Tzu",                       link: "https://www.amazon.com/dp/1599869772",          category: "leadership",     desc: "Ancient treatise on strategy, positioning, and winning without unnecessary conflict. Every principle maps directly to business competition if you know how to read it." },
  { title: "Winning at Work Without Losing at Love", author: "Bryan E. Robinson",             link: "https://www.amazon.com/dp/0062512501",          category: "leadership",     desc: "Robinson on maintaining healthy relationships while pursuing high performance at work. Work addiction is real, and this book names it clearly without flinching." },
  // faith
  { title: "The Screwtape Letters",                  author: "C.S. Lewis",                   link: "https://www.amazon.com/dp/0060652934",          category: "faith",          desc: "Lewis writes from the perspective of a senior demon coaching a junior one on how to corrupt a human soul. One of the most revealing books on spiritual warfare ever written." },
  { title: "The Great Divorce",                      author: "C.S. Lewis",                   link: "https://www.amazon.com/dp/0060652950",          category: "faith",          desc: "Lewis imagines a bus ride from the outskirts of hell to the edge of heaven — and what keeps people from choosing God. A profound exploration of pride, choice, and grace." },
  { title: "Mere Christianity",                      author: "C.S. Lewis",                   link: "https://www.amazon.com/dp/0060652926",          category: "faith",          desc: "Lewis's rational and accessible case for the Christian faith, built from first principles. Starts with moral law and arrives at the full picture of who Jesus is and why it matters." },
  { title: "Visioneering",                           author: "Andy Stanley",                 link: "https://www.amazon.com/dp/1590521668",          category: "faith",          desc: "Stanley on how God-given vision shapes a life of meaning, purpose, and sustained effort. Vision isn't wishful thinking — it's a moral imperative that demands faithful action." },
  { title: "The Real You",                           author: "Bryant McGill",                link: "https://www.amazon.com/s?k=the+real+you+bryant+mcgill", category: "faith", desc: "A raw challenge to strip away external expectations and live from the inside out. McGill on self-awareness, personal freedom, and becoming who you were actually made to be." },
  // personal growth
  { title: "Four Thousand Weeks",                    author: "Oliver Burkeman",               link: "https://www.amazon.com/dp/0374159122",          category: "personal growth", desc: "Burkeman's counterintuitive take on time management — you can't do it all, and accepting that is the only honest starting point. Finite time, fully embraced, is more freeing than any system." },
  { title: "Building a Second Brain",                author: "Tiago Forte",                  link: "https://www.amazon.com/dp/1982167386",          category: "personal growth", desc: "Forte's system for capturing, organizing, and retrieving the ideas and information that actually matter. Your notes should work for you — not just pile up and go unread." },
  { title: "The Last Lecture",                       author: "Randy Pausch",                 link: "https://www.amazon.com/dp/1401323251",          category: "personal growth", desc: "Pausch's final lecture, delivered after a terminal cancer diagnosis, on achieving your childhood dreams. One of the most honest and humanly generous things ever put on paper." },
  { title: "Greenlights",                            author: "Matthew McConaughey",           link: "https://www.amazon.com/dp/0593139135",          category: "personal growth", desc: "McConaughey's memoir told through journal entries spanning decades of his life. A meditation on perception, timing, and finding the meaning in whatever season you're in." },
  { title: "The Alchemist",                          author: "Paulo Coelho",                 link: "https://www.amazon.com/dp/0062315005",          category: "personal growth", desc: "Coelho's parable about following your Personal Legend no matter what tries to stop you. Short, simple, and it lands differently every time you pick it up." },
  { title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey",           link: "https://www.amazon.com/dp/1982137274",          category: "personal growth", desc: "Covey's framework for living and leading from principles that don't expire. Timeless guidance on effectiveness that holds up across every decade and every context." },
  { title: "His Needs Her Needs",                    author: "Willard F. Harley Jr.",        link: "https://www.amazon.com/dp/0800718321",          category: "personal growth", desc: "Harley's research on the top emotional needs of husbands and wives, and what happens when they go unmet. Meeting those needs consistently is what builds a marriage that lasts." },
  { title: "The Art of Patience",                    author: "Thibault Meurisse",            link: "https://www.amazon.com/s?k=the+art+of+patience+meurisse", category: "personal growth", desc: "Meurisse on mastering one of the most underrated skills in building anything worth having. Urgency is overrated — patience is a real competitive advantage." },
  { title: "Beethoven's Anvil",                      author: "William Benzon",               link: "https://www.amazon.com/dp/0465007643",          category: "personal growth", desc: "Benzon's deep-dive into music as biology, culture, and social connection. Challenges how you think about creativity, community, and what actually binds human beings together." },
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
