import { normalizeProfile } from "../../site/questions.js";
import { getSystemPrompt, resolveVersion, buildUserPrompt } from "../../site/prompt.js";

const json = (body, status, cors) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...cors } });

export default {
  async fetch(request, env) {
    const origin = (request.headers.get("origin") || "").toLowerCase();
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    const cors = {
      "access-control-allow-origin": allowed.includes(origin) ? origin : allowed[0] || "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      vary: "origin",
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST" || new URL(request.url).pathname !== "/generate") return json({ error: "Not found" }, 404, cors);
    if (allowed.length && !allowed.includes(origin)) return json({ error: "Origin not allowed" }, 403, cors);
    if (env.EXPIRES_AT && Date.now() > Date.parse(env.EXPIRES_AT)) {
      return json({ error: "The live generator has closed after the session. Use “Copy prompt” to run it in your own AI assistant." }, 410, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, cors);
    }
    if (env.EVENT_CODE && (body.eventCode || "").trim().toUpperCase() !== env.EVENT_CODE.toUpperCase()) {
      return json({ error: "Wrong event code. Check the code on the session slide." }, 401, cors);
    }

    const { profile, missing } = normalizeProfile(body.profile);
    if (missing.length) return json({ error: `Missing: ${missing.join(", ")}` }, 400, cors);
    const version = resolveVersion(body.promptVersion);

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: env.MODEL || "gpt-6.1-sol",
        instructions: getSystemPrompt(version),
        input: buildUserPrompt(profile),
        stream: true,
        store: false,
        // Reasoning tokens count toward this cap, so leave headroom above the ~3k-token path.
        max_output_tokens: Number(env.MAX_OUTPUT_TOKENS || 16000),
        reasoning: { effort: env.REASONING_EFFORT || "low" },
        text: { verbosity: "medium" },
        // Static instructions come first, so OpenAI's automatic prefix caching applies across attendees.
        prompt_cache_key: `ai-upskill-path-${version}`,
      }),
    });

    if (!upstream.ok) {
      console.error("openai error", upstream.status, await upstream.text());
      return json({ error: "The AI service is busy right now. Try again in a minute, or use “Copy prompt”." }, 502, cors);
    }

    return new Response(upstream.body, {
      headers: { "content-type": "text/event-stream", "cache-control": "no-cache", ...cors },
    });
  },
};
