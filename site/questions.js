// Shared by the page (rendering) and the Worker (validation). Keep it DOM-free.

export const ROLES = [
  { value: "dev", label: "Developer" },
  { value: "qa", label: "QA / SDET" },
  { value: "product", label: "Product (PM / PO / BA)" },
  { value: "ops", label: "Ops (DevOps / SRE / Platform)" },
  { value: "data", label: "Data (Engineering / Science)" },
  { value: "design", label: "Design (UX / UI)" },
  { value: "lead", label: "Engineering leadership (EM, Delivery, Director)" },
];

export const SPECIALIZATIONS = {
  dev: [
    "Chatbots & RAG knowledge assistants",
    "AI agents & workflow automation",
    "Voice AI (speech-to-text, TTS, voice agents)",
    "Computer vision & video / surveillance",
    "Document extraction (OCR / IDP)",
    "AI in the frontend (streaming & generative UI)",
    "Recommendation & personalization",
    "On-device / edge AI",
  ],
  qa: [
    "LLM evals & quality metrics",
    "AI-assisted test automation",
    "Red-teaming & AI safety testing",
    "Testing RAG & agent systems",
    "Performance & cost testing of AI features",
  ],
  product: [
    "AI product strategy & opportunity discovery",
    "Rapid prototyping with AI tools",
    "AI UX & trust design",
    "Evals & success metrics for AI features",
    "AI governance & responsible AI",
  ],
  ops: [
    "LLMOps & observability",
    "Self-hosted LLMs (vLLM, Ollama, GPUs on K8s)",
    "AI cost optimization (FinOps)",
    "AI for Ops (incident copilots, AIOps)",
    "AI security & guardrails",
    "MLOps pipelines",
  ],
  data: [
    "Data pipelines for RAG",
    "ML engineering & MLOps",
    "Analytics with AI (text-to-SQL)",
    "Fine-tuning & synthetic data",
  ],
  design: [
    "AI-assisted design workflows",
    "Designing AI-native UX",
    "Prototyping with AI tools",
  ],
  lead: [
    "AI adoption & enablement for my team",
    "AI-native team roles & workflows",
    "Scoping, estimating & pricing Gen AI projects",
    "Gen AI solutioning & pre-sales for clients",
    "AI governance, security & client data",
    "Measuring AI productivity & ROI",
  ],
};

// The AI ladder from the session deck. Rung 0 means not started yet.
export const RUNGS = [
  { level: 0, name: "Not started", blurb: "AI isn't part of your work yet." },
  { level: 1, name: "Use AI", blurb: "Chat tools and prompting for everyday work." },
  { level: 2, name: "Build with Gen AI", blurb: "Agentic coding tools, rules, skills, hooks and specs." },
  { level: 3, name: "Enable your team", blurb: "Shared skills, agents and a harness that make a team AI-native." },
  { level: 4, name: "Build Gen AI apps", blurb: "LLM APIs, a simple RAG, chatbot or agent." },
  { level: 5, name: "Architect Gen AI apps", blurb: "Agentic and multi-agent design, evals, RAG vs NL2SQL vs fine-tuning." },
];

// Separate from the ladder, not rungs above it.
export const BUILDINGS = [
  { key: "tuning", name: "Model tuning / ML", blurb: "Fine-tune with LoRA, run small models on company data, serve them." },
  { key: "models", name: "Models", blurb: "Pretrain and post-train, as frontier and sovereign labs do." },
];

// Each item marks either a rung or a building as reached.
export const EXPOSURE = [
  {
    group: "Use AI",
    items: [
      { value: "chat", rung: 1, label: "Use ChatGPT / Claude / Gemini for work tasks" },
      { value: "prompting", rung: 1, label: "Write structured prompts (examples, steps, roles) to get reliable answers" },
    ],
  },
  {
    group: "Build with Gen AI",
    items: [
      { value: "assistant", rung: 2, label: "Use an agentic coding tool daily (Claude Code, Cursor, Codex, Copilot agent)" },
      { value: "rules", rung: 2, label: "Set up rules, skills or custom commands (CLAUDE.md, AGENTS.md, Cursor rules)" },
      { value: "agentic", rung: 2, label: "Connect MCP servers, hooks or subagents to your coding tool" },
      { value: "spec", rung: 2, label: "Work spec-first: write the spec, let the agent build, review the result" },
    ],
  },
  {
    group: "Enable your team",
    items: [
      { value: "shared", rung: 3, label: "Built shared skills, rules or agents that your team uses" },
      { value: "harness", rung: 3, label: "Set up a team harness: AI checks in CI, review guardrails, sandboxes" },
    ],
  },
  {
    group: "Build Gen AI apps",
    items: [
      { value: "api", rung: 4, label: "Called an LLM API from code (OpenAI, Anthropic, Bedrock, Azure OpenAI)" },
      { value: "rag", rung: 4, label: "Built a simple RAG or chatbot (embeddings, chunking, vector search)" },
      { value: "agents", rung: 4, label: "Built a tool-calling agent or an MCP server" },
    ],
  },
  {
    group: "Architect Gen AI apps",
    items: [
      { value: "multiagent", rung: 5, label: "Designed an agentic or multi-agent system" },
      { value: "prod", rung: 5, label: "Run evals and observability on a production Gen AI feature" },
      { value: "choose", rung: 5, label: "Chose between prompting, RAG, NL2SQL and fine-tuning for a real problem" },
    ],
  },
  {
    group: "Model tuning / ML (separate building)",
    items: [
      { value: "classicml", building: "tuning", label: "Trained classical ML models (scikit-learn, XGBoost)" },
      { value: "finetune", building: "tuning", label: "Fine-tuned a model (LoRA, SFT)" },
      { value: "serve", building: "tuning", label: "Served your own model (vLLM, Ollama, SageMaker)" },
    ],
  },
  {
    group: "Models (separate building)",
    items: [{ value: "pretrain", building: "models", label: "Pretrained or post-trained a model, research-grade" }],
  },
];

export const FIELDS = {
  experience: {
    label: "Experience level",
    type: "single",
    options: [
      { value: "fresher", label: "Fresher / Junior Engineer" },
      { value: "engineer", label: "Engineer" },
      { value: "senior", label: "Senior Engineer" },
      { value: "lead", label: "Lead / Staff / Principal / Architect" },
      { value: "em", label: "EM and above" },
    ],
  },
  role: { label: "Role", type: "single", options: ROLES },
  scope: {
    label: "What does your role cover?",
    type: "single",
    options: [
      { value: "tech", label: "Pure tech" },
      { value: "tech_delivery", label: "Tech + Delivery" },
      { value: "tech_delivery_people", label: "Tech + Delivery + People" },
    ],
  },
  languages: {
    label: "Language ecosystems you work in",
    type: "multi",
    options: ["Python", "JavaScript / TypeScript", "Java", ".NET / C#", "Go", "Rust", "PHP", "Android (Kotlin)", "iOS (Swift)", "Flutter", "None / not applicable"].map((v) => ({ value: v, label: v })),
  },
  python: {
    label: "Python",
    type: "single",
    options: [
      { value: "skip", label: "No Python, keep my path in my own languages" },
      { value: "strong", label: "I'm comfortable in Python" },
      { value: "refresher", label: "Basic, I'd like a refresher" },
      { value: "rampup", label: "New to it, include a Python track" },
    ],
  },
  exposure: { label: "What have you already done?", type: "multi", options: EXPOSURE.flatMap((g) => g.items) },
  specializations: {
    label: "Specializations that interest you",
    type: "multi",
    options: Object.values(SPECIALIZATIONS).flat().map((v) => ({ value: v, label: v })),
  },
  cloud: {
    label: "Cloud your projects run on",
    type: "multi",
    options: ["AWS", "Azure", "GCP", "On-prem / self-hosted", "Not sure / none"].map((v) => ({ value: v, label: v })),
  },
  goal: {
    label: "Where do you want to be in 3–6 months?",
    type: "single",
    options: [
      { value: "productivity", label: "Get much faster at my daily work with AI tools" },
      { value: "build_apps", label: "Build GenAI features and agents into products" },
      { value: "models", label: "Go deep: ML, fine-tuning, model engineering" },
      { value: "lead_adoption", label: "Lead AI adoption for my team or clients" },
    ],
  },
  hours: {
    label: "Time you can give each week",
    type: "single",
    options: [
      { value: "1-2", label: "1–2 hrs" },
      { value: "3-5", label: "3–5 hrs" },
      { value: "6-10", label: "6–10 hrs" },
      { value: "10+", label: "10+ hrs" },
    ],
  },
  style: {
    label: "How do you learn best?",
    type: "multi",
    options: ["Reading (docs, articles, books)", "Video courses", "Hands-on building", "Learning with people (meetups, pairing)"].map((v) => ({ value: v, label: v })),
  },
};

export const REQUIRED = ["experience", "role", "scope", "goal", "hours"];
const MAX_TEXT = 500;

const pickOne = (field, v) => (FIELDS[field].options.some((o) => o.value === v) ? v : null);
const pickMany = (field, arr) =>
  Array.isArray(arr) ? [...new Set(arr)].filter((v) => FIELDS[field].options.some((o) => o.value === v)) : [];
const clip = (s, n = MAX_TEXT) => (typeof s === "string" ? s.trim().slice(0, n) : "");

// Drops unknown fields and values, so arbitrary input never reaches the prompt.
// Rung 3 (Enable your team) only applies to leads and above.
export const TEAM_RUNG = 3;
export const teamRungApplies = (profile) => ["lead", "em"].includes(profile.experience);
const TEAM_RUNG_ITEMS = EXPOSURE.flatMap((g) => g.items).filter((i) => i.rung === TEAM_RUNG).map((i) => i.value);

export function normalizeProfile(raw = {}) {
  const p = {
    name: clip(raw.name, 60),
    experience: pickOne("experience", raw.experience),
    role: pickOne("role", raw.role),
    scope: pickOne("scope", raw.scope),
    languages: pickMany("languages", raw.languages),
    python: pickOne("python", raw.python),
    exposure: pickMany("exposure", raw.exposure),
    specializations: pickMany("specializations", raw.specializations),
    otherSpecialization: clip(raw.otherSpecialization, 120),
    cloud: pickMany("cloud", raw.cloud),
    goal: pickOne("goal", raw.goal),
    hours: pickOne("hours", raw.hours),
    style: pickMany("style", raw.style),
    notes: clip(raw.notes),
  };
  if (!teamRungApplies(p)) p.exposure = p.exposure.filter((v) => !TEAM_RUNG_ITEMS.includes(v));
  // Working in Python means they know it; the Python question doesn't apply.
  if (p.languages.includes("Python")) p.python = "strong";
  const missing = REQUIRED.filter((k) => !p[k]);
  return { profile: p, missing };
}

// Highest rung reached, rungs skipped below it, and which buildings they've been in.
export function computeLadder(profile) {
  const done = EXPOSURE.flatMap((g) => g.items).filter((i) => profile.exposure.includes(i.value));
  const ticked = new Set(done.filter((i) => i.rung).map((i) => i.rung));
  // Any rung implies using AI; enabling a team implies rung 2; architecting implies building.
  if (ticked.size) ticked.add(1);
  if (ticked.has(3)) ticked.add(2);
  if (ticked.has(5)) ticked.add(4);
  const reached = [...ticked].sort((a, b) => a - b);
  const top = Math.max(0, ...reached);
  return {
    highest: RUNGS[top],
    reached,
    gaps: RUNGS.filter((r) => r.level > 0 && r.level < top && !reached.includes(r.level) && (r.level !== TEAM_RUNG || teamRungApplies(profile))),
    buildings: BUILDINGS.map((b) => ({ ...b, visited: done.some((i) => i.building === b.key) })),
  };
}

export const labelOf = (field, value) => FIELDS[field].options.find((o) => o.value === value)?.label ?? value;
