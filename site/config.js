// Set after deploying the Worker (see README). Leave empty to run in copy-prompt-only mode.
window.APP_CONFIG = {
  WORKER_URL: "https://ai-upskill-path.jeavio-ai.workers.dev",
  // "v1": prose path, "v2": tabular week-by-week path. Override per visit with ?v=1 or ?v=2.
  PROMPT_VERSION: "v2",
};
