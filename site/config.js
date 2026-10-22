// Set after deploying the Worker (see README). Leave empty to run in copy-prompt-only mode.
window.APP_CONFIG = {
  // Empty = copy-prompt-only mode (no generation with our key).
  // To turn generation back on: "https://ai-upskill-path.jeavio-ai.workers.dev"
  WORKER_URL: "",
  // "v1": prose path, "v2": tabular week-by-week path. Override per visit with ?v=1 or ?v=2.
  PROMPT_VERSION: "v2",
};
