// Shared by the page (rendering) and the Worker (validation). Keep it DOM-free.

export const ROLES = [
  { value: "dev", label: "Developer" },
  { value: "qa", label: "QA / SDET" },
  { value: "product", label: "Product (PM / PO / BA)" },
  { value: "ops", label: "Ops (DevOps / SRE / Platform)" },
  { value: "data", label: "Data (Engineering / Science)" },
  { value: "design", label: "Design (UX / UI)" },
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
};

export const STAGES = [
  { level: 0, name: "AI Curious", blurb: "You know AI matters but haven't made it part of your work yet." },
  { level: 1, name: "AI User", blurb: "You use chat assistants for everyday tasks." },
  { level: 2, name: "AI-Augmented", blurb: "AI tools are part of how you work every day." },
  { level: 3, name: "GenAI Builder", blurb: "You build features on top of LLM APIs." },
  { level: 4, name: "AI Systems Builder", blurb: "You ship agents and production GenAI with evals and monitoring." },
  { level: 5, name: "Model Builder", blurb: "You fine-tune or train models." },
];

// "level" feeds the starting stage; 0 means it's context only and doesn't move the stage.
export const EXPOSURE = [
  {
    group: "Building with AI — AI as your tool",
    items: [
      { value: "chat", level: 1, label: "Use ChatGPT / Claude / Gemini for work tasks" },
      { value: "assistant", level: 2, label: "Use an AI coding or work assistant daily (Copilot, Cursor, Claude Code)" },
      { value: "agentic", level: 2, label: "Hand off multi-step tasks to agentic tools, with custom rules / MCP servers" },
    ],
  },
  {
    group: "Building GenAI applications",
    items: [
      { value: "api", level: 3, label: "Called an LLM API from code (OpenAI, Anthropic, Bedrock, Azure OpenAI)" },
      { value: "rag", level: 3, label: "Built RAG: embeddings, chunking, vector search" },
      { value: "agents", level: 4, label: "Built tool-calling agents or MCP servers" },
      { value: "prod", level: 4, label: "Shipped a GenAI feature to production with evals & monitoring" },
    ],
  },
  {
    group: "Building AI — models",
    items: [
      { value: "classicml", level: 0, label: "Trained classical ML models (scikit-learn, XGBoost)" },
      { value: "finetune", level: 5, label: "Fine-tuned a model (LoRA, SFT)" },
      { value: "dl", level: 5, label: "Trained deep learning models (PyTorch / TensorFlow)" },
    ],
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
    options: ["Python", "JavaScript / TypeScript", "Java", ".NET / C#", "Go", "Rust", "PHP", "Mobile (Kotlin / Swift / Flutter)", "None / not applicable"].map((v) => ({ value: v, label: v })),
  },
  python: {
    label: "Python",
    type: "single",
    options: [
      { value: "strong", label: "I'm comfortable in Python" },
      { value: "refresher", label: "Basic, I'd like a refresher" },
      { value: "rampup", label: "New to it, include a Python track" },
      { value: "skip", label: "New to it, keep me in my own ecosystem" },
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
    options: ["Hands-on projects", "Video courses", "Docs & articles", "Books"].map((v) => ({ value: v, label: v })),
  },
};

export const REQUIRED = ["experience", "role", "scope", "goal", "hours"];
const MAX_TEXT = 500;

const pickOne = (field, v) => (FIELDS[field].options.some((o) => o.value === v) ? v : null);
const pickMany = (field, arr) =>
  Array.isArray(arr) ? [...new Set(arr)].filter((v) => FIELDS[field].options.some((o) => o.value === v)) : [];
const clip = (s, n = MAX_TEXT) => (typeof s === "string" ? s.trim().slice(0, n) : "");

// Drops unknown fields and values, so arbitrary input never reaches the prompt.
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
  const missing = REQUIRED.filter((k) => !p[k]);
  return { profile: p, missing };
}

export function computeStage(profile) {
  const levels = EXPOSURE.flatMap((g) => g.items)
    .filter((i) => profile.exposure.includes(i.value))
    .map((i) => i.level);
  return STAGES[Math.max(0, ...levels)];
}

export const labelOf = (field, value) => FIELDS[field].options.find((o) => o.value === value)?.label ?? value;
