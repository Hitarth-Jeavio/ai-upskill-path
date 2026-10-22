# AI Upskill Path · Jeavio AI Meetup

A single-page app for the "How to upskill yourself in AI" session. Attendees answer about 12 quick questions. The page places them on the session's AI ladder (rungs 1–5, plus the separate model buildings) on the spot, and then a GPT model writes a personalized learning path that builds on what they already know.

```
GitHub Pages (static site/)  ──POST /generate──▶  Cloudflare Worker  ──▶  OpenAI Responses API (gpt-6.1-sol)
        ▲                                         holds OPENAI_API_KEY        streams Markdown back
        └──────────── streamed path (SSE) ◀───────┘
```

- **No key in the browser.** GitHub Pages is static, so a small Worker holds the API key.
- **Turns itself off.** The Worker stops answering after `EXPIRES_AT`, so "our key, for the day only" is enforced.
- **No hallucinated links.** The model may only cite URLs from `site/catalog.js`. That's 247 curated resources (including 36 videos), all checked to resolve, with SDK links for every language the form offers.
- **Always has a fallback.** "Copy prompt for my own AI" gives attendees the exact same prompt to paste into ChatGPT, Claude or Gemini. It works without the Worker, and after the event.
- **Nothing stored on a server.** Answers, the last generated path and its progress stay in the attendee's browser (localStorage). Requests go to OpenAI with `store: false`.
- **Built to come back to.** The path opens with "Start this week", each phase's weekly plan is collapsible, tasks and "Done when" items can be ticked off with a progress bar, and a returning attendee gets an "Open it" link to their saved path.

## Repo layout

| Path | What it is |
| --- | --- |
| `site/index.html`, `styles.css`, `app.js` | The page, in Jeavio's design language |
| `site/questions.js` | Question set, AI ladder and buildings, input validation (shared with the Worker) |
| `site/prompt.js` | System prompt and user prompt builder (shared with the Worker) |
| `site/catalog.js` | Curated resources. The only links the model may use |
| `site/config.js` | `WORKER_URL`. Leave it empty for copy-prompt-only mode |
| `worker/` | Cloudflare Worker that proxies to OpenAI |
| `.github/workflows/pages.yml` | Deploys `site/` to GitHub Pages on every push to `main` |

## 1. Deploy the Worker (about 10 min)

You need a free Cloudflare account and an OpenAI API key, ideally from a dedicated OpenAI project with a budget limit.

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put OPENAI_API_KEY      # paste the key
```

In `worker/wrangler.toml`:
- Set `ALLOWED_ORIGINS` to your Pages origin, e.g. `https://jeavio.github.io`. That's the origin only, with no repo path.
- Set `EXPIRES_AT` to when the generator should stop, in UTC.
- Optionally set `MODEL` to `gpt-6-astra` for the top tier, at about 5× the cost.

```bash
npx wrangler deploy        # prints https://ai-upskill-path.<subdomain>.workers.dev
```

## 2. Publish on GitHub Pages (about 5 min)

1. Put the Worker URL in `site/config.js`: `WORKER_URL: "https://ai-upskill-path.<subdomain>.workers.dev"`.
2. Create a GitHub repo, e.g. `jeavio/ai-upskill-path`, and push:
   ```bash
   git init -b main && git add . && git commit -m "AI upskill path app"
   git remote add origin git@github.com:<org>/ai-upskill-path.git
   git push -u origin main
   ```
3. In the repo, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. The `Deploy site to GitHub Pages` workflow runs on the push. Re-run it from the **Actions** tab if it ran before step 3. The site goes live at `https://<org>.github.io/ai-upskill-path/`.
5. Optional: add a custom domain such as `ai.jeavio.com` under **Settings → Pages → Custom domain** with a CNAME record. Then add that origin to `ALLOWED_ORIGINS` and redeploy the Worker.

> Pages on a **private** repo needs a paid GitHub plan (Team or Enterprise). On the free plan, the repo must be public. That's fine here: the key lives in the Worker, not in the repo.

## 3. Event-day runbook

- Share `https://<org>.github.io/ai-upskill-path/` as a QR code.
- In the OpenAI dashboard, set a hard budget on the project. There's no event code, so anyone with the link can generate a path until `EXPIRES_AT`; the budget is the backstop.
- Watch live logs with `cd worker && npx wrangler tail`.
- After the session, the Worker returns "closed" once `EXPIRES_AT` passes, and the page points people to the copy-prompt fallback. To shut it down early, run `npx wrangler secret delete OPENAI_API_KEY`.

**Rough cost (an estimate, not measured):** one path is about 5.5k input tokens and about 5k output tokens (including low-effort reasoning). At gpt-6.1-sol list prices ($2 / $10 per 1M tokens), that's about **$0.06 per attendee**, or about **$6 for 100 people**. gpt-6-astra comes to about 5× that. Prompt caching on the shared system prompt lowers the input share further.

## Local development

```bash
cd worker && cp .dev.vars.example .dev.vars   # add your key
npx wrangler dev                               # http://localhost:8787
# in another terminal
cd site && python3 -m http.server 8080         # http://localhost:8080/
```
For local runs, temporarily set `WORKER_URL: "http://localhost:8787"` in `site/config.js`.

## Changing content

- **Questions or specializations:** edit `site/questions.js`. The form renders from it, and the Worker validates against it.
- **Resources:** add entries to `site/catalog.js`. Set `kind` to `learn` (a video, course, article or book with a finite length) or `reference` (docs, repos, tools), and `duration` to the length the source itself states, or leave it empty. The model uses these to size each task's hours. Then check the links:
  ```bash
  node --input-type=module -e 'import("./site/catalog.js").then(async ({CATALOG})=>{for(const c of CATALOG){const r=await fetch(c.url,{redirect:"follow"}).catch(e=>({status:e.message}));if(r.status!==200)console.log(r.status,c.id,c.url)}})'
  ```
- **Copy-prompt only:** set `WORKER_URL: ""` in `site/config.js` to turn off generation with our key. Attendees then copy the prompt into their own ChatGPT, Claude or Gemini. Put the Worker URL back to turn generation on again.
- **Prompt:** edit `site/prompt.js`, then redeploy **both** the site (push) and the Worker (`npx wrangler deploy`). The Worker bundles its own copy of the prompt.

## Prompt versions

`site/prompt.js` holds two output formats that share the same design and resource rules:

| Version | Output |
| --- | --- |
| `v1` | Markdown prose with phase sections (the original prompt) |
| `v2` | Tables: where you stand, skills, roadmap, and a week-by-week plan for each phase (default) |

- The default is set by `PROMPT_VERSION` in `site/config.js`.
- Adding `?v=1` or `?v=2` to the page URL overrides it for that visit, for side-by-side comparison, e.g. `https://jeaviollc.github.io/ai-upskill-path/?v=1`.
- The page sends the version to the Worker. The Worker accepts only the versions defined in `prompt.js` and falls back to the default otherwise.
- The copy-prompt fallback uses the same version.
