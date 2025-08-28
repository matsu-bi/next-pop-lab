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
