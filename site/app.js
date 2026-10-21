import { FIELDS, EXPOSURE, SPECIALIZATIONS, RUNGS, BUILDINGS, REQUIRED, TEAM_RUNG, normalizeProfile, computeLadder, teamRungApplies, labelOf } from "./questions.js";
import { buildFullPrompt, resolveVersion } from "./prompt.js";

const WORKER_URL = (window.APP_CONFIG?.WORKER_URL || "").replace(/\/$/, "");
// ?v=1 or ?v=v2 overrides config.js, e.g. to compare prompt versions side by side.
const urlVersion = new URLSearchParams(location.search).get("v");
const PROMPT_VERSION = resolveVersion(urlVersion ? `v${urlVersion.replace(/^v/i, "")}` : window.APP_CONFIG?.PROMPT_VERSION);
const STORE_KEY = "ai-upskill-answers";
const PATH_KEY = "ai-upskill-path";
const PROGRESS_KEY = "ai-upskill-progress";
const COLORS = ["var(--orange)", "var(--teal)", "var(--green)", "var(--yellow)"];

const $ = (sel) => document.querySelector(sel);
const form = $("#form");
const steps = [...document.querySelectorAll(".step")];
let current = 0;
let reached = 0;
let markdown = "";
let pathId = "";
const openPlans = new Set();

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
    const hint = REQUIRED.includes(key) ? null : el("span", { className: "opt", textContent: f.type === "multi" ? "pick any" : "optional · click again to clear" });
    const type = f.type === "multi" ? "checkbox" : "radio";
    q.append(
      el("p", { className: "q-label" }, f.label, hint ? " " : null, hint),
      el("div", { className: "chips" }, ...f.options.map((o) => chip(key, o.value, o.label, type)))
    );
    const note = q.querySelector(".inline-note");
    if (note) q.append(note);
  });

  $("#exposure").append(
    ...EXPOSURE.map((g, gi) => {
      const title = el("p", { className: "exp-title", textContent: g.group });
      title.style.setProperty("--accent", COLORS[gi % 4]);
      const group = el(
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
      group.dataset.rung = g.items[0].rung ?? "";
      return group;
    })
  );

  // Top rung first, matching the slide.
  $("#ladder").append(
    ...RUNGS.filter((r) => r.level > 0).reverse().map((r) => {
      const li = el("li", { className: "rung", title: r.blurb },
        el("span", { className: "rung-name", textContent: r.name }),
        el("span", { className: "rung-tag" }));
      li.dataset.level = r.level;
      return li;
    })
  );
  $("#buildings").append(
    el("p", { className: "branch", textContent: "Different buildings" }),
    ...BUILDINGS.map((b) =>
      el("div", { className: "building", title: b.blurb },
        el("span", { className: "b-name", textContent: b.name }),
        el("span", { className: "b-status", textContent: "Not yet" }))
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

// Keeps the rail's ladder, buildings and answer summary in sync with the form.
function updateRail() {
  const { profile } = normalizeProfile(readForm());
  const ladder = computeLadder(profile);
  const gaps = ladder.gaps.map((g) => g.level);
  [...$("#ladder").children].forEach((li) => {
    const level = Number(li.dataset.level);
    const state = level === ladder.highest.level ? "now" : gaps.includes(level) ? "gap" : ladder.reached.includes(level) ? "reached" : "";
    li.className = `rung ${state}`;
    li.querySelector(".rung-tag").textContent = state === "now" ? "Here" : state === "gap" ? "Gap" : "";
  });
  $("#ground").classList.toggle("now", ladder.highest.level === 0);
  // The Python question only applies when Python isn't one of their languages.
  const pyQuestion = document.querySelector('[data-field="python"]');
  pyQuestion.hidden = profile.languages.includes("Python");
  if (pyQuestion.hidden) pyQuestion.querySelectorAll("input:checked").forEach((i) => (i.checked = false));

  // Nudge, without blocking, when a fine-tuning goal meets a no-Python answer.
  $("#pyNote").hidden = !(profile.goal === "models" && !["strong", "refresher", "rampup"].includes(profile.python));

  // Hide rung 3 below Lead level, and clear anything ticked there.
  const teamRung = teamRungApplies(profile);
  [...$("#ladder").children].forEach((li) => (li.hidden = Number(li.dataset.level) === TEAM_RUNG && !teamRung));
  const teamGroup = document.querySelector(`.exp-group[data-rung="${TEAM_RUNG}"]`);
  teamGroup.hidden = !teamRung;
  if (!teamRung) teamGroup.querySelectorAll("input:checked").forEach((i) => (i.checked = false));
  [...$("#buildings").querySelectorAll(".building")].forEach((node, i) => {
    const visited = ladder.buildings[i].visited;
    node.classList.toggle("visited", visited);
    node.querySelector(".b-status").textContent = visited ? "Been inside" : "Not yet";
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
      toc.push(node);
      continue;
    }
    (body || out).append(node);
  }
  out.querySelectorAll("table").forEach((t) => {
    const wrap = el("div", { className: "table-scroll" });
    t.before(wrap);
    wrap.append(t);
  });
  out.querySelectorAll(".tl-body a[href], blockquote a[href]").forEach((a) => {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  // Pin "Start this week" first so the next step is the first thing they see.
  const items = [...out.querySelectorAll(".tl-item")];
  const start = items.find((i) => /^Start this week/i.test(i.querySelector("h2").textContent));
  if (start && items[0] !== start) items[0].before(start);

  for (const item of out.querySelectorAll(".tl-item")) {
    const title = item.querySelector("h2").textContent;
    // Task rows and "Done when" items become checkboxes that remember progress.
    item.querySelectorAll("table").forEach((t) => {
      const cols = [...t.querySelectorAll("thead th")].map((th) => th.textContent.trim());
      if (!cols.includes("Week") || !cols.includes("What to do")) return;
      // Show depth as a tag under the topic, saving a column.
      const heads = [...t.querySelectorAll("thead th")].map((th) => th.textContent.trim());
      const di = heads.indexOf("Depth"), ti = heads.indexOf("Topic");
      if (di >= 0 && ti >= 0) {
        t.querySelectorAll("tr").forEach((tr) => {
          const cells = tr.children;
          if (tr.parentElement.tagName === "TBODY") cells[ti].append(el("span", { className: "depth-tag", textContent: cells[di].textContent.trim() }));
          cells[di].remove();
        });
      }
      t.querySelector("thead tr").prepend(el("th", { textContent: "Done" }));
      t.querySelectorAll("thead th").forEach((th) => th.classList.add(`col-${th.textContent.trim().toLowerCase().replace(/[^a-z]+/g, "-")}`));
      t.querySelectorAll("tbody tr").forEach((tr) => {
        const box = el("input", { type: "checkbox", className: "task-box" });
        box.dataset.key = `${title}|${tr.textContent.replace(/\s+/g, " ").trim()}`;
        box.setAttribute("aria-label", "Mark task done");
        tr.prepend(el("td", { className: "done-cell" }, box));
      });
    });
    item.querySelectorAll('li > input[type="checkbox"]').forEach((box) => {
      box.disabled = false;
      box.dataset.key = `${title}|${box.parentElement.textContent.replace(/\s+/g, " ").trim()}`;
    });
    // Phases show goal, build and outcomes; the weekly rows collapse.
    if (!/^(Phase|Python ramp-up|Specialization track)/i.test(title)) continue;
    const body = item.querySelector(".tl-body");
    const table = body.querySelector(".table-scroll");
    if (!table) continue;
    const rows = [...table.querySelectorAll("tbody tr")];
    const hours = rows.reduce((sum, r) => sum + (parseFloat(r.lastElementChild?.textContent) || 0), 0);
    const extra = [...body.querySelectorAll("p")].find((p) => /^Additional sources/i.test(p.textContent.trim()));
    const plan = el("details", { className: "plan" },
      el("summary", { textContent: `Weekly plan · ${rows.length} task${rows.length === 1 ? "" : "s"}${hours ? ` · ${hours} hrs` : ""}` }));
    plan.dataset.key = title;
    plan.open = openPlans.has(title);
    table.before(plan);
    plan.append(table);
    if (extra) plan.append(extra);
  }

  $("#toc").replaceChildren(...[...out.querySelectorAll(".tl-item h2")].map((h) => {
    const link = el("a", { href: `#${h.id}`, textContent: h.textContent.replace(/\s*\(Weeks?[^)]*\)/i, "") });
    link.style.setProperty("--bar", h.closest(".tl-item").style.getPropertyValue("--bar"));
    return link;
  }));
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
    applyProgress();
  });
}

function setStatus(msg, isError = false) {
  const s = $("#status");
  s.textContent = msg;
  s.classList.toggle("error", isError);
}

function showFallback(profile, open = false) {
  $("#fallbackText").value = buildFullPrompt(profile, PROMPT_VERSION);
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

function savedProgress() {
  const p = store.get(PROGRESS_KEY);
  return p && p.id === pathId ? p.done : {};
}

function applyProgress() {
  const done = savedProgress();
  const boxes = [...$("#output").querySelectorAll("input[data-key]")];
  boxes.forEach((b) => (b.checked = !!done[b.dataset.key]));
  const n = boxes.filter((b) => b.checked).length;
  $("#progressTrack").hidden = !boxes.length;
  $("#ptFill").style.width = boxes.length ? `${(100 * n) / boxes.length}%` : "0";
  $("#ptText").textContent = `${n} of ${boxes.length} done`;
}

function refreshSavedBanner() {
  const saved = store.get(PATH_KEY);
  $("#savedBanner").hidden = !saved?.markdown;
  if (saved?.markdown) {
    const day = new Date(saved.at).toLocaleDateString(undefined, { day: "numeric", month: "short" });
    $("#savedText").textContent = `You have a saved learning path from ${day}.`;
  }
}

async function generate(profile) {
  markdown = "";
  pathId = String(Date.now());
  openPlans.clear();
  $("#output").replaceChildren();
  $("#toc").replaceChildren();
  $("#actions").hidden = true;
  $("#fallback").hidden = true;
  setStatus("Analysing your answers and writing your path. This takes about a minute…");

  try {
    const res = await fetch(`${WORKER_URL}/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ profile, promptVersion: PROMPT_VERSION }),
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
    store.set(PATH_KEY, { id: pathId, markdown, title: $("#resultTitle").textContent, at: Date.now() });
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

  if (!WORKER_URL) $("#copyPromptBtn").className = "btn btn-primary";

  restoreForm(store.get(STORE_KEY));
  updateRail();
  goTo(0);
  refreshSavedBanner();

  $("#openSavedBtn").addEventListener("click", () => {
    const saved = store.get(PATH_KEY);
    if (!saved) return;
    pathId = saved.id;
    markdown = saved.markdown;
    openPlans.clear();
    $("#wizard").hidden = true;
    $("#result").hidden = false;
    $("#resultTitle").textContent = saved.title;
    $("#actions").hidden = false;
    $("#fallback").hidden = true;
    setStatus("");
    render();
    window.scrollTo({ top: 0 });
  });
  $("#output").addEventListener("change", (e) => {
    const key = e.target.dataset?.key;
    if (!key || !pathId) return;
    const done = { ...savedProgress() };
    if (e.target.checked) done[key] = true;
    else delete done[key];
    store.set(PROGRESS_KEY, { id: pathId, done });
    applyProgress();
  });
  // "toggle" doesn't bubble, so listen in the capture phase to remember open plans.
  $("#output").addEventListener("toggle", (e) => {
    if (!e.target.classList?.contains("plan")) return;
    if (e.target.open) openPlans.add(e.target.dataset.key);
    else openPlans.delete(e.target.dataset.key);
  }, true);
  // Print the full plan, not just the collapsed summaries.
  window.addEventListener("beforeprint", () => document.querySelectorAll("details.plan").forEach((d) => { d.dataset.wasOpen = d.open; d.open = true; }));
  window.addEventListener("afterprint", () => document.querySelectorAll("details.plan").forEach((d) => (d.open = d.dataset.wasOpen === "true")));

  form.addEventListener("change", (e) => {
    if (e.target.name === "role") renderSpecs(e.target.value, readForm().specializations);
    // Pre-select the leadership role for EM and above; undo it only if we set it and they move away from EM.
    if (e.target.name === "experience") {
      const lead = form.querySelector('input[name="role"][value="lead"]');
      if (e.target.value === "em" && !lead.checked && !form.dataset.roleChosen) {
        lead.checked = true;
        lead.dataset.auto = "1";
        renderSpecs("lead", readForm().specializations);
        lead.closest(".q")?.classList.remove("invalid");
      } else if (e.target.value !== "em" && lead.checked && lead.dataset.auto) {
        lead.checked = false;
        renderSpecs(null);
      }
    }
    if (e.target.name === "role") {
      form.dataset.roleChosen = "1";
      delete form.querySelector('input[name="role"][value="lead"]').dataset.auto;
    }
    e.target.closest(".q")?.classList.remove("invalid");
    if (!document.querySelector(".q.invalid")) $("#formError").textContent = "";
    store.set(STORE_KEY, readForm());
    updateRail();
  });
  form.addEventListener("input", () => store.set(STORE_KEY, readForm()));
  // Optional single-choice answers can be cleared by clicking the chosen chip again.
  const lastPick = {};
  form.addEventListener("pointerdown", (e) => {
    const input = e.target.closest(".chip")?.querySelector('input[type="radio"]');
    if (input && !REQUIRED.includes(input.name)) lastPick[input.name] = input.checked ? input.value : null;
  });
  form.addEventListener("click", (e) => {
    const input = e.target.closest('input[type="radio"]');
    if (!input || REQUIRED.includes(input.name) || lastPick[input.name] !== input.value) return;
    input.checked = false;
    lastPick[input.name] = null;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
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
    const ok = await copyText(buildFullPrompt(profile, PROMPT_VERSION), "Prompt copied. Paste it into ChatGPT, Claude or Gemini.");
    if (!ok) $("#fallbackText").select();
  });

  $("#editBtn").addEventListener("click", () => {
    $("#result").hidden = true;
    $("#wizard").hidden = false;
    refreshSavedBanner();
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
