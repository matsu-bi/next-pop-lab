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
