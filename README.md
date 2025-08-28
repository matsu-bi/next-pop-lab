# next-pop-lab

TypeScript CLI project for pop culture lab experiments.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the CLI:
```bash
npm start -- --help
```

3. Build the project:
```bash
npm run build
```

4. Run built version:
```bash
npm run run -- --help
```

## GDELT API Commands

Fetch articles from GDELT DOC 2.0 API:

```bash
# Basic usage
npx ts-node src/index.ts --topic "defense budget Japan" --hours 24

# With custom parameters
npx ts-node src/index.ts --topic "climate change" --hours 48 --maxArticles 10

# Short timespan
npx ts-node src/index.ts --topic "AI technology" --hours 6 --maxArticles 5
```

Options:
- `--topic`: Search topic for GDELT articles (required)
- `--hours`: Time span in hours to search (default: 24)
- `--maxArticles`: Maximum number of articles to fetch (default: 8)
- `--ollamaModel`: Ollama model to use for summarization (optional)

## Ollama Integration Commands

Generate AI-powered summaries with Markdown output:

```bash
# Prerequisites: Start Ollama and pull model
ollama serve
ollama pull qwen2.5:7b

# Generate summary and save to Markdown
npx ts-node src/index.ts --topic "防衛費 増額" --hours 24 --ollamaModel "qwen2.5:7b"

# Other examples
npx ts-node src/index.ts --topic "climate change policy" --hours 48 --ollamaModel "qwen2.5:7b" --maxArticles 10
npx ts-node src/index.ts --topic "AI regulation" --hours 12 --ollamaModel "qwen2.5:7b"
```

The generated Markdown files are saved to `output/yyyymmdd_hhmm_<topic>.md` with:
- Article summary in Japanese (3-7 bullet points)
- Source links with metadata
- Copyright notice about fair use

## X (Twitter) Integration Commands

Analyze X posts with stance classification and generate visual reports:

```bash
# Prerequisites: Set up environment variable
echo "X_BEARER_TOKEN=your_bearer_token_here" >> .env

# Full workflow with X integration
npx ts-node src/index.ts --topic "防衛費 増額" --withX --xLang "en,ja" --ollamaModel "qwen2.5:7b"

# X integration with custom parameters
npx ts-node src/index.ts --topic "climate change" --withX --xMax 100 --xLang "en" --ollamaModel "qwen2.5:7b"

# Skip X integration if no bearer token
npx ts-node src/index.ts --topic "AI regulation" --withX --ollamaModel "qwen2.5:7b"
```

**X Integration Options:**
- `--withX`: Enable X posts collection and analysis
- `--xMax`: Maximum number of X posts to fetch (default: 80)
- `--xLang`: Languages for X posts, comma-separated (e.g. "en,ja")

**Environment Variables:**
- `X_BEARER_TOKEN`: Required for X API access. If not set, X features are gracefully skipped.

**Generated Files:**
- Markdown report: `output/yyyymmdd_hhmm_<topic>.md`
- SVG stance chart: `output/yyyymmdd_hhmm_<topic>_stance.svg`

The X integration adds:
- Stance analysis (support/oppose/neutral/unknown) using Ollama
- Visual bar chart showing stance distribution
- Sample posts (up to 10) with metadata
- Automatic fallback handling for API errors
