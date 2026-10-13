import { FIELDS, EXPOSURE, SPECIALIZATIONS, STAGES, REQUIRED, normalizeProfile, computeStage, labelOf } from "./questions.js";
import { buildFullPrompt } from "./prompt.js";

const WORKER_URL = (window.APP_CONFIG?.WORKER_URL || "").replace(/\/$/, "");
const STORE_KEY = "ai-upskill-answers";
const CODE_KEY = "ai-upskill-code";
const COLORS = ["var(--orange)", "var(--teal)", "var(--green)", "var(--yellow)"];

const $ = (sel) => document.querySelector(sel);
const form = $("#form");
const steps = [...document.querySelectorAll(".step")];
let current = 0;
let reached = 0;
let markdown = "";

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children.filter((c) => c != null));
  return node;
}

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 3200);
}

const chip = (name, value, label, type) =>
  el("label", { className: "chip" }, el("input", { type, name, value }), el("span", { textContent: label }));

function renderStatic() {
  document.querySelectorAll("[data-field]").forEach((q) => {
    const key = q.dataset.field;
    const f = FIELDS[key];
    const hint = REQUIRED.includes(key) ? null : el("span", { className: "opt", textContent: f.type === "multi" ? "pick any" : "optional" });
    const type = f.type === "multi" ? "checkbox" : "radio";
    q.append(
      el("p", { className: "q-label" }, f.label, hint ? " " : null, hint),
      el("div", { className: "chips" }, ...f.options.map((o) => chip(key, o.value, o.label, type)))
    );
  });

  $("#exposure").append(
    ...EXPOSURE.map((g, gi) => {
      const title = el("p", { className: "exp-title", textContent: g.group });
      title.style.setProperty("--accent", COLORS[gi % 4]);
      return el(
        "div",
        { className: "exp-group" },
        title,
        el(
          "div",
          { className: "exp-list" },
          ...g.items.map((i) =>
            el("label", { className: "check" }, el("input", { type: "checkbox", name: "exposure", value: i.value }), el("span", { textContent: i.label }))
          )
        )
      );
    })
  );

  $("#meter").append(
    ...STAGES.map((s) =>
      el("li", {}, el("span", { className: "dot" }), el("div", {}, el("div", { className: "name", textContent: s.name }), el("div", { className: "blurb", textContent: s.blurb })))
    )
  );

  $("#progress").append(
    ...steps.map((s, i) => {
      const b = el("button", { type: "button", textContent: `${String(i + 1).padStart(2, "0")} ${s.dataset.title}` });
      b.style.setProperty("--seg", COLORS[i % 4]);
      b.addEventListener("click", () => goTo(i));
      return b;
    })
  );
}

function renderSpecs(role, selected = []) {
  const box = $("#specs");
  if (!role) return box.replaceChildren(el("p", { className: "hint", textContent: "Pick a role in step 1 to see options." }));
  box.replaceChildren(...SPECIALIZATIONS[role].map((s) => chip("specializations", s, s, "checkbox")));
  box.querySelectorAll("input").forEach((i) => (i.checked = selected.includes(i.value)));
}

function readForm() {
  const fd = new FormData(form);
  const raw = {};
  for (const [k, f] of Object.entries(FIELDS)) raw[k] = f.type === "multi" ? fd.getAll(k) : fd.get(k);
  for (const k of ["name", "otherSpecialization", "notes"]) raw[k] = fd.get(k) || "";
  return raw;
}

function restoreForm(raw) {
  if (!raw) return renderSpecs(null);
  for (const k of ["name", "otherSpecialization", "notes"]) if (raw[k]) form.elements[k].value = raw[k];
  renderSpecs(raw.role, raw.specializations || []);
  for (const k of Object.keys(FIELDS)) {
    const vals = [].concat(raw[k] || []);
    form.querySelectorAll(`input[name="${k}"]`).forEach((i) => (i.checked = vals.includes(i.value)));
  }
}

// Keeps the rail's stage meter and answer summary in sync with the form.
function updateRail() {
  const { profile } = normalizeProfile(readForm());
  const stage = computeStage(profile);
  $("#meter").querySelectorAll("li").forEach((li, i) => {
    li.className = i < stage.level ? "done" : i === stage.level ? "now" : "";
  });

  const one = (k) => (profile[k] ? labelOf(k, profile[k]) : "");
  const many = (k) => profile[k].map((v) => labelOf(k, v)).join(", ");
  const rows = [
    ["Role", one("role")],
    ["Level", one("experience")],
    ["Scope", one("scope")],
    ["Stack", many("languages")],
    ["Cloud", many("cloud")],
    ["Goal", one("goal")],
    ["Time", profile.hours ? `${one("hours")} / week` : ""],
  ];
  $("#summary").replaceChildren(
    ...rows.flatMap(([k, v]) => [el("dt", { textContent: k }), el("dd", { textContent: v || "—", className: v ? "" : "empty" })])
  );
}

const stepFields = (i) => [...steps[i].querySelectorAll("[data-field]")].map((q) => q.dataset.field);

function markMissing(missing) {
  document.querySelectorAll(".q.invalid").forEach((q) => q.classList.remove("invalid"));
  missing.forEach((k) => document.querySelector(`[data-field="${k}"]`)?.classList.add("invalid"));
  $("#formError").textContent = missing.length ? "Please answer the highlighted questions." : "";
}

function stepMissing(i) {
  const { missing } = normalizeProfile(readForm());
  return missing.filter((k) => stepFields(i).includes(k));
}

function goTo(i) {
  if (i > reached) return;
  current = i;
  steps.forEach((s, n) => (s.hidden = n !== i));
  $("#progress").querySelectorAll("button").forEach((b, n) => {
    b.className = n === i ? "now" : n < reached || n < i ? "done" : "";
    b.disabled = n > reached;
  });
  const last = i === steps.length - 1;
  $("#backBtn").disabled = i === 0;
  $("#nextBtn").hidden = last;
  $("#generateBtn").hidden = !last || !WORKER_URL;
  $("#copyPromptBtn").hidden = !last;
  markMissing([]);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function next() {
  const missing = stepMissing(current);
  markMissing(missing);
  if (missing.length) return;
  reached = Math.max(reached, current + 1);
  goTo(current + 1);
}

// Validates everything; jumps back to the first step with a missing answer.
function validateAll() {
  const { profile, missing } = normalizeProfile(readForm());
  if (!missing.length) return profile;
  const first = steps.findIndex((_, i) => stepFields(i).some((k) => missing.includes(k)));
  goTo(first);
  markMissing(missing.filter((k) => stepFields(first).includes(k)));
  return null;
}

function showResult(profile) {
  $("#wizard").hidden = true;
  $("#result").hidden = false;
  $("#resultTitle").textContent = profile.name ? `${profile.name}, here's your path.` : "Here's your path.";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Turns each h2 section into a timeline node and builds the contents list from them.
function enhance(frag) {
  const out = document.createDocumentFragment();
  const toc = [];
  let body = null;
  for (const node of [...frag.childNodes]) {
    if (node.nodeName === "H2") {
      const n = toc.length;
      const color = COLORS[n % 4];
      node.id = `sec-${n}`;
      body = el("div", { className: "tl-body" });
      const item = el("section", { className: "tl-item" }, node, body);
      item.style.setProperty("--bar", color);
      out.append(item);
      const link = el("a", { href: `#sec-${n}`, textContent: node.textContent.replace(/\s*\(Weeks?[^)]*\)/i, "") });
      link.style.setProperty("--bar", color);
      toc.push(link);
      continue;
    }
    (body || out).append(node);
  }
  out.querySelectorAll(".tl-body a[href], blockquote a[href]").forEach((a) => {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
  $("#toc").replaceChildren(...toc);
  return out;
}

let renderQueued = false;
function render() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    const frag = DOMPurify.sanitize(marked.parse(markdown, { gfm: true, breaks: true }), {
      RETURN_DOM_FRAGMENT: true,
      FORBID_TAGS: ["img", "style", "form", "iframe"],
    });
    $("#output").replaceChildren(enhance(frag));
  });
}

function setStatus(msg, isError = false) {
  const s = $("#status");
  s.textContent = msg;
  s.classList.toggle("error", isError);
}

function showFallback(profile, open = false) {
  $("#fallbackText").value = buildFullPrompt(profile);
  $("#fallback").hidden = false;
  $("#fallback").open = open;
}

// Handles one OpenAI Responses API stream event; returns a status note when the stream ends early.
function handleEvent(data) {
  switch (data.type) {
    case "response.output_text.delta":
      markdown += data.delta;
      render();
      return null;
    case "response.incomplete":
      return "Your path was cut short. Download what's here, or generate again.";
    case "response.failed":
      throw new Error(data.response?.error?.message || "The AI service couldn't finish your path.");
    case "error":
      throw new Error(data.message || data.error?.message || "The AI service returned an error.");
    default:
      return null;
  }
}

async function generate(profile) {
  markdown = "";
  $("#output").replaceChildren();
  $("#toc").replaceChildren();
  $("#actions").hidden = true;
  $("#fallback").hidden = true;
  setStatus("Analysing your answers and writing your path. This takes about a minute…");

  try {
    const res = await fetch(`${WORKER_URL}/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ profile, eventCode: $("#eventCode").value }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Request failed (${res.status})`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let note = null;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const events = buf.split("\n\n");
      buf = events.pop();
      for (const evt of events) {
        const line = evt.split("\n").find((l) => l.startsWith("data:"));
        if (line && line !== "data: [DONE]") note = handleEvent(JSON.parse(line.slice(5))) || note;
      }
    }
    if (!markdown) throw new Error("No response received.");
    setStatus(note || "");
    $("#actions").hidden = false;
    showFallback(profile);
  } catch (e) {
    setStatus(e.message, true);
    if (markdown) $("#actions").hidden = false;
    showFallback(profile, true);
  }
}

async function copyText(text, okMsg) {
  try {
    await navigator.clipboard.writeText(text);
    toast(okMsg);
    return true;
  } catch {
    return false;
  }
}

function init() {
  renderStatic();

  const urlCode = new URLSearchParams(location.search).get("code");
  if (urlCode) store.set(CODE_KEY, urlCode);
  const code = urlCode || store.get(CODE_KEY);
  if (code) $("#eventCode").value = code;
  $("#codeWrap").hidden = !WORKER_URL || !!code;
  if (!WORKER_URL) $("#copyPromptBtn").className = "btn btn-primary";

  restoreForm(store.get(STORE_KEY));
  updateRail();
  goTo(0);

  form.addEventListener("change", (e) => {
    if (e.target.name === "role") renderSpecs(e.target.value, readForm().specializations);
    e.target.closest(".q")?.classList.remove("invalid");
    if (!document.querySelector(".q.invalid")) $("#formError").textContent = "";
    store.set(STORE_KEY, readForm());
    updateRail();
  });
  form.addEventListener("input", () => store.set(STORE_KEY, readForm()));
  // Enter in a text field shouldn't skip ahead or submit early.
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT") e.preventDefault();
  });

  $("#nextBtn").addEventListener("click", next);
  $("#backBtn").addEventListener("click", () => goTo(Math.max(0, current - 1)));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const profile = validateAll();
    if (!profile) return;
    showResult(profile);
    generate(profile);
  });

  $("#copyPromptBtn").addEventListener("click", async () => {
    const profile = validateAll();
    if (!profile) return;
    showResult(profile);
    setStatus(WORKER_URL ? "" : "Paste the prompt into ChatGPT, Claude or Gemini to get your path.");
    showFallback(profile, true);
    const ok = await copyText(buildFullPrompt(profile), "Prompt copied. Paste it into ChatGPT, Claude or Gemini.");
    if (!ok) $("#fallbackText").select();
  });

  $("#editBtn").addEventListener("click", () => {
    $("#result").hidden = true;
    $("#wizard").hidden = false;
    goTo(steps.length - 1);
  });
  $("#copyBtn").addEventListener("click", () => copyText(markdown, "Path copied as Markdown."));
  $("#printBtn").addEventListener("click", () => window.print());
  $("#downloadBtn").addEventListener("click", () => {
    const a = el("a", { href: URL.createObjectURL(new Blob([markdown], { type: "text/markdown" })), download: "my-ai-learning-path.md" });
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

init();
