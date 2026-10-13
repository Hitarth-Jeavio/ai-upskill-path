# AI Upskill Path · Jeavio AI Community

A single-page app for the "How to upskill yourself in AI" session. Attendees answer about 12 quick questions. The page works out their current AI stage on the spot, and then a GPT model writes a personalised learning path that builds on what they already know.

```
GitHub Pages (static site/)  ──POST /generate──▶  Cloudflare Worker  ──▶  OpenAI Responses API (gpt-6.1-sol)
        ▲                                         holds OPENAI_API_KEY        streams Markdown back
        └──────────── streamed path (SSE) ◀───────┘
```

- **No key in the browser.** GitHub Pages is static, so a small Worker holds the API key.
- **Turns itself off.** The Worker stops answering after `EXPIRES_AT`, so "our key, for the day only" is enforced.
- **No hallucinated links.** The model may only cite URLs from `site/catalog.js`. That's 105 curated resources, all checked to resolve.
- **Always has a fallback.** "Copy prompt for my own AI" gives attendees the exact same prompt to paste into ChatGPT, Claude or Gemini. It works without the Worker, and after the event.
- **Nothing stored.** Answers stay in the attendee's browser (localStorage) and go to OpenAI with `store: false`.

## Repo layout

| Path | What it is |
| --- | --- |
| `site/index.html`, `styles.css`, `app.js` | The page, in Jeavio's design language |
| `site/questions.js` | Question set, stage ladder, input validation (shared with the Worker) |
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
npx wrangler secret put EVENT_CODE          # optional, e.g. AICOMM; shown on the slide or baked into the QR link
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

- Share `https://<org>.github.io/ai-upskill-path/?code=AICOMM` as a QR code. The `?code=` pre-fills the event code, so attendees never type it.
- In the OpenAI dashboard, set a hard budget on the project.
- Watch live logs with `cd worker && npx wrangler tail`.
- After the session, the Worker returns "closed" once `EXPIRES_AT` passes, and the page points people to the copy-prompt fallback. To shut it down early, run `npx wrangler secret delete OPENAI_API_KEY`.

**Rough cost (an estimate, not measured):** one path is about 5.5k input tokens and about 5k output tokens (including low-effort reasoning). At gpt-6.1-sol list prices ($2 / $10 per 1M tokens), that's about **$0.06 per attendee**, or about **$6 for 100 people**. gpt-6-astra comes to about 5× that. Prompt caching on the shared system prompt lowers the input share further.

## Local development

```bash
cd worker && cp .dev.vars.example .dev.vars   # add your key
npx wrangler dev                               # http://localhost:8787
# in another terminal
cd site && python3 -m http.server 8080         # http://localhost:8080/?code=AICOMM
```
For local runs, temporarily set `WORKER_URL: "http://localhost:8787"` in `site/config.js`.

## Changing content

- **Questions or specializations:** edit `site/questions.js`. The form renders from it, and the Worker validates against it.
- **Resources:** add entries to `site/catalog.js`, then check the links:
  ```bash
  node --input-type=module -e 'import("./site/catalog.js").then(async ({CATALOG})=>{for(const c of CATALOG){const r=await fetch(c.url,{redirect:"follow"}).catch(e=>({status:e.message}));if(r.status!==200)console.log(r.status,c.id,c.url)}})'
  ```
- **Prompt:** edit `site/prompt.js`, then redeploy **both** the site (push) and the Worker (`npx wrangler deploy`). The Worker bundles its own copy of the prompt.
