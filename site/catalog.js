// Curated resources. The LLM may only link to URLs listed here, which prevents hallucinated links.
// Fields: id, title, url, tags (topics/ecosystems/roles), level (1-5 on the stage ladder), free, format.
export const CATALOG = [
  // Foundations / concepts
  { id: "karpathy-intro-llm", title: "Andrej Karpathy — Intro to Large Language Models (1h talk)", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", tags: ["foundations", "llm-concepts"], level: 1, free: true, format: "video" },
  { id: "karpathy-deep-dive", title: "Andrej Karpathy — Deep Dive into LLMs like ChatGPT", url: "https://www.youtube.com/watch?v=7xTGNNLPyMI", tags: ["foundations", "llm-concepts"], level: 2, free: true, format: "video" },
  { id: "genai-everyone", title: "DeepLearning.AI — Generative AI for Everyone", url: "https://www.deeplearning.ai/courses/generative-ai-for-everyone/", tags: ["foundations", "product", "leadership"], level: 1, free: true, format: "course" },
  { id: "ai-for-everyone", title: "Coursera — AI For Everyone (Andrew Ng)", url: "https://www.coursera.org/learn/ai-for-everyone", tags: ["foundations", "leadership", "product"], level: 1, free: true, format: "course" },
  { id: "google-ai-essentials", title: "Google — AI Essentials", url: "https://grow.google/ai-essentials/", tags: ["foundations", "productivity"], level: 1, free: false, format: "course" },
  { id: "anthropic-academy", title: "Anthropic Academy — AI Fluency and Claude courses (free)", url: "https://academy.claude.com/", tags: ["foundations", "productivity", "prompting", "leadership"], level: 1, free: true, format: "course" },
  { id: "illustrated-transformer", title: "Jay Alammar — The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/", tags: ["llm-concepts", "deep-learning"], level: 3, free: true, format: "article" },
  { id: "3b1b-nn", title: "3Blue1Brown — Neural Networks series", url: "https://www.3blue1brown.com/topics/neural-networks", tags: ["deep-learning", "foundations", "math"], level: 3, free: true, format: "video" },
  { id: "ms-genai-beginners", title: "Microsoft — Generative AI for Beginners (21 lessons, Python & TS)", url: "https://github.com/microsoft/generative-ai-for-beginners", tags: ["genai-apps", "python", "javascript", "prompting", "rag"], level: 2, free: true, format: "course" },
  { id: "chip-ai-engineering", title: "Chip Huyen — AI Engineering (book)", url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/", tags: ["genai-apps", "evals", "llmops", "architecture"], level: 3, free: false, format: "book" },

  // Prompting
  { id: "anthropic-prompt-eng", title: "Anthropic — Prompt engineering guide", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview", tags: ["prompting"], level: 1, free: true, format: "docs" },
  { id: "anthropic-courses", title: "Anthropic — Courses repo (prompting, API, tool use; notebooks)", url: "https://github.com/anthropics/courses", tags: ["prompting", "genai-apps", "python", "tool-use"], level: 2, free: true, format: "course" },
  { id: "prompting-guide", title: "DAIR.AI — Prompt Engineering Guide", url: "https://www.promptingguide.ai/", tags: ["prompting"], level: 2, free: true, format: "docs" },
  { id: "openai-prompting", title: "OpenAI — Prompt engineering guide", url: "https://developers.openai.com/api/docs/guides/prompt-engineering", tags: ["prompting"], level: 2, free: true, format: "docs" },

  // AI-assisted development
  { id: "claude-code-docs", title: "Claude Code — documentation", url: "https://code.claude.com/docs/en/overview", tags: ["ai-coding", "productivity", "agents"], level: 2, free: true, format: "docs" },
  { id: "copilot-docs", title: "GitHub Copilot — documentation", url: "https://docs.github.com/en/copilot", tags: ["ai-coding", "productivity"], level: 2, free: true, format: "docs" },
  { id: "cursor-docs", title: "Cursor — documentation", url: "https://cursor.com/docs", tags: ["ai-coding", "productivity"], level: 2, free: true, format: "docs" },
  { id: "mcp-docs", title: "Model Context Protocol — official docs", url: "https://modelcontextprotocol.io/", tags: ["mcp", "agents", "tool-use", "ai-coding"], level: 3, free: true, format: "docs" },
  { id: "playwright-mcp", title: "Microsoft — Playwright MCP server", url: "https://github.com/microsoft/playwright-mcp", tags: ["qa", "test-automation", "mcp"], level: 2, free: true, format: "repo" },

  // Building GenAI apps — vendor docs & cookbooks
  { id: "anthropic-cookbook", title: "Anthropic — Claude Cookbooks (RAG, tool use, extraction recipes)", url: "https://github.com/anthropics/claude-cookbooks", tags: ["genai-apps", "python", "rag", "tool-use", "document-extraction"], level: 3, free: true, format: "repo" },
  { id: "openai-cookbook", title: "OpenAI Cookbook", url: "https://developers.openai.com/cookbook", tags: ["genai-apps", "python", "rag", "evals"], level: 3, free: true, format: "docs" },
  { id: "dlai-short-courses", title: "DeepLearning.AI — Short courses (1–2h each, free)", url: "https://www.deeplearning.ai/short-courses/", tags: ["genai-apps", "rag", "agents", "evals", "fine-tuning", "python"], level: 2, free: true, format: "course" },
  { id: "hf-llm-course", title: "Hugging Face — LLM Course", url: "https://huggingface.co/learn/llm-course", tags: ["llm-concepts", "fine-tuning", "python", "deep-learning"], level: 3, free: true, format: "course" },
  { id: "pinecone-learn", title: "Pinecone — Learn (embeddings, vector search, RAG)", url: "https://www.pinecone.io/learn/", tags: ["rag", "embeddings"], level: 3, free: true, format: "article" },
  { id: "pgvector", title: "pgvector — vector search in Postgres", url: "https://github.com/pgvector/pgvector", tags: ["rag", "embeddings", "data"], level: 3, free: true, format: "repo" },
  { id: "llamaindex-docs", title: "LlamaIndex — documentation", url: "https://developers.llamaindex.ai/python/framework/", tags: ["rag", "python", "document-extraction"], level: 3, free: true, format: "docs" },

  // Agents
  { id: "building-effective-agents", title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents", tags: ["agents", "architecture"], level: 3, free: true, format: "article" },
  { id: "hf-agents-course", title: "Hugging Face — AI Agents Course", url: "https://huggingface.co/learn/agents-course", tags: ["agents", "python"], level: 3, free: true, format: "course" },
  { id: "ms-agents-beginners", title: "Microsoft — AI Agents for Beginners", url: "https://github.com/microsoft/ai-agents-for-beginners", tags: ["agents", "python", "dotnet"], level: 3, free: true, format: "course" },
  { id: "langchain-academy", title: "LangChain Academy — Intro to LangGraph (free)", url: "https://academy.langchain.com/", tags: ["agents", "python", "javascript"], level: 3, free: true, format: "course" },
  { id: "langgraph-docs", title: "LangGraph — documentation", url: "https://langchain-ai.github.io/langgraph/", tags: ["agents", "python"], level: 4, free: true, format: "docs" },
  { id: "openai-agents-sdk", title: "OpenAI Agents SDK (Python)", url: "https://openai.github.io/openai-agents-python/", tags: ["agents", "python"], level: 4, free: true, format: "docs" },
  { id: "claude-agent-sdk", title: "Claude Agent SDK — overview", url: "https://code.claude.com/docs/en/agent-sdk/overview", tags: ["agents", "python", "javascript"], level: 4, free: true, format: "docs" },
  { id: "pydantic-ai", title: "Pydantic AI — agent framework", url: "https://pydantic.dev/docs/ai/overview/", tags: ["agents", "python"], level: 3, free: true, format: "docs" },

  // Ecosystem-specific SDKs
  { id: "langchain-py", title: "LangChain (Python) — documentation", url: "https://docs.langchain.com/oss/python/langchain/overview", tags: ["python", "rag", "agents"], level: 3, free: true, format: "docs" },
  { id: "langchain-js", title: "LangChain.js — documentation", url: "https://docs.langchain.com/oss/javascript/langchain/overview", tags: ["javascript", "rag", "agents"], level: 3, free: true, format: "docs" },
  { id: "vercel-ai-sdk", title: "Vercel AI SDK (TypeScript)", url: "https://ai-sdk.dev/", tags: ["javascript", "genai-apps", "frontend-ai", "agents"], level: 3, free: true, format: "docs" },
  { id: "mastra", title: "Mastra — TypeScript agent framework", url: "https://mastra.ai/docs", tags: ["javascript", "agents"], level: 3, free: true, format: "docs" },
  { id: "transformers-js", title: "Transformers.js — run models in the browser", url: "https://huggingface.co/docs/transformers.js", tags: ["javascript", "edge-ai", "frontend-ai"], level: 4, free: true, format: "docs" },
  { id: "spring-ai", title: "Spring AI — reference docs", url: "https://spring.io/projects/spring-ai", tags: ["java", "genai-apps", "rag"], level: 3, free: true, format: "docs" },
  { id: "langchain4j", title: "LangChain4j — LLMs for Java", url: "https://docs.langchain4j.dev/", tags: ["java", "rag", "agents"], level: 3, free: true, format: "docs" },
  { id: "dotnet-ai", title: "Microsoft — AI for .NET developers (Microsoft.Extensions.AI)", url: "https://learn.microsoft.com/en-us/dotnet/ai/", tags: ["dotnet", "genai-apps"], level: 3, free: true, format: "docs" },
  { id: "semantic-kernel", title: "Semantic Kernel — documentation", url: "https://learn.microsoft.com/en-us/semantic-kernel/", tags: ["dotnet", "python", "java", "agents"], level: 3, free: true, format: "docs" },
  { id: "anthropic-go", title: "Anthropic Go SDK", url: "https://github.com/anthropics/anthropic-sdk-go", tags: ["go", "genai-apps"], level: 3, free: true, format: "repo" },
  { id: "openai-go", title: "OpenAI Go SDK", url: "https://github.com/openai/openai-go", tags: ["go", "genai-apps"], level: 3, free: true, format: "repo" },
  { id: "langchaingo", title: "LangChainGo", url: "https://github.com/tmc/langchaingo", tags: ["go", "rag", "agents"], level: 3, free: true, format: "repo" },
  { id: "rig-rs", title: "Rig — LLM apps in Rust", url: "https://github.com/0xPlaygrounds/rig", tags: ["rust", "genai-apps", "agents"], level: 3, free: true, format: "repo" },
  { id: "candle", title: "Hugging Face Candle — ML framework for Rust", url: "https://github.com/huggingface/candle", tags: ["rust", "deep-learning", "edge-ai"], level: 5, free: true, format: "repo" },

  // Evals, quality, safety (QA-heavy)
  { id: "hamel-evals", title: "Hamel Husain — Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/", tags: ["evals", "qa", "product"], level: 3, free: true, format: "article" },
  { id: "openai-evals-guide", title: "OpenAI — Evals guide", url: "https://developers.openai.com/api/docs/guides/evals", tags: ["evals", "qa"], level: 3, free: true, format: "docs" },
  { id: "anthropic-evals", title: "Anthropic — Define success criteria & build evaluations", url: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests", tags: ["evals", "qa"], level: 3, free: true, format: "docs" },
  { id: "promptfoo", title: "promptfoo — LLM evals & red-teaming CLI", url: "https://www.promptfoo.dev/docs/intro/", tags: ["evals", "qa", "red-teaming", "javascript"], level: 3, free: true, format: "docs" },
  { id: "deepeval", title: "DeepEval — pytest-style LLM evaluation", url: "https://deepeval.com/docs/getting-started", tags: ["evals", "qa", "python"], level: 3, free: true, format: "docs" },
  { id: "ragas", title: "Ragas — RAG evaluation metrics", url: "https://docs.ragas.io/", tags: ["evals", "qa", "rag", "python"], level: 4, free: true, format: "docs" },
  { id: "owasp-llm-top10", title: "OWASP — Top 10 for LLM Applications", url: "https://genai.owasp.org/llm-top-10/", tags: ["red-teaming", "security", "qa", "ops"], level: 3, free: true, format: "docs" },
  { id: "langfuse", title: "Langfuse — open-source LLM observability & evals", url: "https://langfuse.com/docs", tags: ["llmops", "evals", "observability", "ops"], level: 4, free: true, format: "docs" },
  { id: "langsmith", title: "LangSmith — tracing & evaluation", url: "https://docs.langchain.com/langsmith/observability", tags: ["llmops", "evals", "observability"], level: 4, free: true, format: "docs" },

  // Ops / cloud / self-hosting
  { id: "aws-bedrock", title: "AWS — Amazon Bedrock user guide", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html", tags: ["aws", "ops", "genai-apps"], level: 3, free: true, format: "docs" },
  { id: "aws-skillbuilder", title: "AWS Skill Builder — GenAI learning plans", url: "https://skillbuilder.aws/", tags: ["aws", "ops", "foundations"], level: 2, free: true, format: "course" },
  { id: "aws-sagemaker", title: "AWS — SageMaker AI developer guide", url: "https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html", tags: ["aws", "ops", "mlops", "fine-tuning"], level: 4, free: true, format: "docs" },
  { id: "azure-ai-foundry", title: "Microsoft — Azure AI Foundry (Microsoft Foundry) documentation", url: "https://learn.microsoft.com/en-us/azure/foundry/", tags: ["azure", "ops", "genai-apps"], level: 3, free: true, format: "docs" },
  { id: "azure-learn-ai", title: "Microsoft Learn — Azure AI training paths", url: "https://learn.microsoft.com/en-us/training/browse/?terms=azure%20ai", tags: ["azure", "ops", "foundations"], level: 2, free: true, format: "course" },
  { id: "gcp-vertex", title: "Google Cloud — Gemini Enterprise Agent Platform (formerly Vertex AI) docs", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models", tags: ["gcp", "ops", "genai-apps", "mlops"], level: 3, free: true, format: "docs" },
  { id: "google-cloud-skills", title: "Google Cloud Skills Boost — Generative AI paths", url: "https://www.skills.google/", tags: ["gcp", "ops", "foundations"], level: 2, free: true, format: "course" },
  { id: "ollama", title: "Ollama — run open models locally", url: "https://ollama.com/", tags: ["self-hosting", "ops", "edge-ai"], level: 2, free: true, format: "tool" },
  { id: "vllm", title: "vLLM — high-throughput LLM serving", url: "https://docs.vllm.ai/", tags: ["self-hosting", "ops", "llmops"], level: 4, free: true, format: "docs" },
  { id: "made-with-ml", title: "Made With ML — MLOps course", url: "https://madewithml.com/", tags: ["mlops", "ops", "python", "data"], level: 4, free: true, format: "course" },

  // Building AI — ML, DL, fine-tuning
  { id: "google-mlcc", title: "Google — Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course", tags: ["ml-foundations", "python", "data"], level: 3, free: true, format: "course" },
  { id: "ms-ml-beginners", title: "Microsoft — ML for Beginners", url: "https://github.com/microsoft/ML-For-Beginners", tags: ["ml-foundations", "python", "data"], level: 3, free: true, format: "course" },
  { id: "kaggle-learn", title: "Kaggle Learn — short hands-on ML courses", url: "https://www.kaggle.com/learn", tags: ["ml-foundations", "python", "data"], level: 3, free: true, format: "course" },
  { id: "fastai", title: "fast.ai — Practical Deep Learning for Coders", url: "https://course.fast.ai/", tags: ["deep-learning", "python", "computer-vision"], level: 4, free: true, format: "course" },
  { id: "karpathy-zero-to-hero", title: "Andrej Karpathy — Neural Networks: Zero to Hero", url: "https://karpathy.ai/zero-to-hero.html", tags: ["deep-learning", "llm-concepts", "python"], level: 5, free: true, format: "video" },
  { id: "llms-from-scratch", title: "Sebastian Raschka — Build a Large Language Model (From Scratch) code", url: "https://github.com/rasbt/LLMs-from-scratch", tags: ["deep-learning", "llm-concepts", "fine-tuning", "python"], level: 5, free: true, format: "repo" },
  { id: "hf-peft", title: "Hugging Face — PEFT (LoRA) docs", url: "https://huggingface.co/docs/peft", tags: ["fine-tuning", "python"], level: 5, free: true, format: "docs" },
  { id: "hf-trl", title: "Hugging Face — TRL (SFT, DPO) docs", url: "https://huggingface.co/docs/trl", tags: ["fine-tuning", "python"], level: 5, free: true, format: "docs" },
  { id: "unsloth", title: "Unsloth — fast LoRA fine-tuning (free Colab notebooks)", url: "https://docs.unsloth.ai/", tags: ["fine-tuning", "python", "colab"], level: 5, free: true, format: "docs" },

  // Specializations
  { id: "hf-audio-course", title: "Hugging Face — Audio Course (ASR, TTS)", url: "https://huggingface.co/learn/audio-course", tags: ["voice", "python"], level: 4, free: true, format: "course" },
  { id: "whisper", title: "OpenAI Whisper — speech recognition", url: "https://github.com/openai/whisper", tags: ["voice", "python"], level: 3, free: true, format: "repo" },
  { id: "pipecat", title: "Pipecat — open-source voice agent framework", url: "https://docs.pipecat.ai/", tags: ["voice", "agents", "python"], level: 4, free: true, format: "docs" },
  { id: "livekit-agents", title: "LiveKit Agents — realtime voice AI", url: "https://docs.livekit.io/agents/", tags: ["voice", "agents", "python", "javascript"], level: 4, free: true, format: "docs" },
  { id: "hf-cv-course", title: "Hugging Face — Computer Vision Course", url: "https://huggingface.co/learn/computer-vision-course", tags: ["computer-vision", "python"], level: 4, free: true, format: "course" },
  { id: "ultralytics", title: "Ultralytics YOLO — detection, tracking, segmentation", url: "https://docs.ultralytics.com/", tags: ["computer-vision", "surveillance", "python", "edge-ai"], level: 3, free: true, format: "docs" },
  { id: "opencv", title: "OpenCV — documentation & tutorials", url: "https://docs.opencv.org/4.x/", tags: ["computer-vision", "surveillance", "python"], level: 3, free: true, format: "docs" },
  { id: "roboflow-blog", title: "Roboflow — computer vision tutorials", url: "https://roboflow.com/blog", tags: ["computer-vision", "surveillance"], level: 3, free: true, format: "article" },
  { id: "docling", title: "Docling — PDF/DOCX parsing for GenAI", url: "https://github.com/docling-project/docling", tags: ["document-extraction", "rag", "python"], level: 3, free: true, format: "repo" },
  { id: "unstructured", title: "Unstructured — document ETL for LLMs", url: "https://docs.unstructured.io/", tags: ["document-extraction", "rag", "data"], level: 3, free: true, format: "docs" },
  { id: "aws-textract", title: "AWS — Amazon Textract developer guide", url: "https://docs.aws.amazon.com/textract/latest/dg/what-is.html", tags: ["document-extraction", "aws"], level: 3, free: true, format: "docs" },
  { id: "azure-doc-intel", title: "Microsoft — Azure AI Document Intelligence", url: "https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/", tags: ["document-extraction", "azure"], level: 3, free: true, format: "docs" },
  { id: "claude-pdf", title: "Anthropic — PDF support (vision + structured extraction)", url: "https://platform.claude.com/docs/en/build-with-claude/pdf-support", tags: ["document-extraction", "genai-apps"], level: 3, free: true, format: "docs" },

  // Product / design / leadership
  { id: "pair-guidebook", title: "Google PAIR — People + AI Guidebook", url: "https://pair.withgoogle.com/guidebook/", tags: ["product", "design", "ai-ux"], level: 2, free: true, format: "docs" },
  { id: "hax-toolkit", title: "Microsoft — HAX Toolkit (Human-AI eXperience)", url: "https://www.microsoft.com/en-us/haxtoolkit/", tags: ["product", "design", "ai-ux"], level: 2, free: true, format: "docs" },
  { id: "nist-ai-rmf", title: "NIST — AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework", tags: ["governance", "leadership", "security"], level: 3, free: true, format: "docs" },

  // Python ramp-up
  { id: "py-tutorial", title: "Python.org — The official Python tutorial", url: "https://docs.python.org/3/tutorial/", tags: ["python-ramp"], level: 1, free: true, format: "docs" },
  { id: "exercism-python", title: "Exercism — Python track (mentored exercises)", url: "https://exercism.org/tracks/python", tags: ["python-ramp"], level: 1, free: true, format: "course" },
  { id: "automate-boring", title: "Automate the Boring Stuff with Python (free online book)", url: "https://automatetheboringstuff.com/", tags: ["python-ramp"], level: 1, free: true, format: "book" },
  { id: "real-python", title: "Real Python — tutorials", url: "https://realpython.com/", tags: ["python-ramp", "python"], level: 2, free: true, format: "article" },
  { id: "uv-docs", title: "uv — fast Python package & project manager", url: "https://docs.astral.sh/uv/", tags: ["python-ramp", "python"], level: 2, free: true, format: "docs" },
  { id: "fastapi-tutorial", title: "FastAPI — tutorial", url: "https://fastapi.tiangolo.com/tutorial/", tags: ["python-ramp", "python", "genai-apps"], level: 2, free: true, format: "docs" },
  { id: "pydantic-docs", title: "Pydantic — data validation (used by most AI SDKs)", url: "https://pydantic.dev/docs/validation/latest/get-started/", tags: ["python-ramp", "python"], level: 2, free: true, format: "docs" },
  { id: "pandas-10min", title: "pandas — 10 minutes to pandas", url: "https://pandas.pydata.org/docs/user_guide/10min.html", tags: ["python-ramp", "data"], level: 2, free: true, format: "docs" },
  { id: "colab", title: "Google Colab — run notebooks in the browser, free GPU", url: "https://colab.research.google.com/", tags: ["python-ramp", "colab", "python"], level: 1, free: true, format: "tool" },
  { id: "hf-hub", title: "Hugging Face Hub — models, datasets, Spaces", url: "https://huggingface.co/docs/hub/index", tags: ["python", "deep-learning", "foundations"], level: 3, free: true, format: "docs" },

  // Staying current
  { id: "simon-willison", title: "Simon Willison's Weblog — practical LLM notes", url: "https://simonwillison.net/", tags: ["stay-current"], level: 2, free: true, format: "article" },
  { id: "latent-space", title: "Latent Space — AI engineering podcast & newsletter", url: "https://www.latent.space/", tags: ["stay-current"], level: 3, free: true, format: "article" },
  { id: "the-batch", title: "DeepLearning.AI — The Batch (weekly newsletter)", url: "https://www.deeplearning.ai/the-batch/", tags: ["stay-current", "leadership"], level: 1, free: true, format: "article" },
];
