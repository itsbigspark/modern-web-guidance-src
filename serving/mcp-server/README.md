# Modern Web MCP

An Model Context Protocol (MCP) server that provides access to modern web development best practices, guides, and baseline browser support data.

## Features

- **Semantic Search**: Search for web development patterns and guides using natural language.
- **Best Practices**: Retrieve curated implementation guides for common web UI components (e.g., tooltips, carousels).
- **Baseline Support**: Check browser compatibility and "Baseline" status for web features.
- **Operational Guide**: Includes an `AGENTS.md` guide for AI agents to follow strict operational rules.

## Installation & Setup

### Prerequisites

- Node.js (v20 or higher recommended)
- `npm`

### 1. Install Dependencies

```bash
npm install
```

### 2. Build & Initialize Database

This project uses a local **LanceDB** vector database to power its semantic search capabilities. The database is built from the source markdown guides located in `src/guides`.

You **MUST** run the build script before starting the server. This script does two things:
1.  Generates the vector embeddings and populates `/.mcp-data/`.
2.  Compiles the TypeScript code to `/build`.

```bash
npm run build
```

> [!IMPORTANT]
> If you skip this step, the server will fail to start or return empty search results because the vector database will be missing.

### 3. Start the Server

```bash
npm start
```

## Testing Semantic Search

You can test the semantic search capabilities using the demo script:

```bash
npx tsx scripts/demo-search.ts "fading in and growing an image as the user scrolls down"

# 🔎 Searching for: "fading in and growing an image as the user scrolls down"
#
# Vectorizing query...
#   ↳ Took 102.30ms
# Querying LanceDB...
#   ↳ Took 25.60ms
#
# Top Results:
#
# 1. [scroll-driven-animations] (ui) - Distance: 0.7985
#    Create animations linked to scroll position
#
# 2. [carousel] (ui) - Distance: 1.1250
#    Build responsive, accessible carousels with CSS Scroll Snap
```

```bash
npx tsx scripts/demo-search.ts "loading a low quality image placeholder on slow networks"

# 🔎 Searching for: "loading a low quality image placeholder on slow networks"
#
# Vectorizing query...
#   ↳ Took 104.78ms
# Querying LanceDB...
#   ↳ Took 21.99ms
#
# Top Results:
#
# 1. [adaptive-loading] (webperf) - Distance: 0.8285
#    Load a fallback image when network conditions are poor using the Adaptive Loading API
#
# 2. [lazy-load-images] (webperf) - Distance: 0.9499
#    Defer loading of off-screen images to minimize network contention and improve LCP.
```

```bash
npx tsx scripts/demo-search.ts "showing a tooltip when hovering over a button"

# 🔎 Searching for: "showing a tooltip when hovering over a button"
#
# Vectorizing query...
#   ↳ Took 97.52ms
# Querying LanceDB...
#   ↳ Took 23.72ms
#
# Top Results:
#
# 1. [tooltip] (ui) - Distance: 0.6308
#    Create tooltips with Popover API and Interest Invokers
#
# 2. [color-systems] (ui) - Distance: 1.3888
#    Create dynamic, accessible color systems using modern color syntax and relative colors
```

## Development

To run the server in development mode with hot-reloading:

```bash
npm run dev
```

## Architecture

- **`src/guides/`**: Source markdown files containing web development patterns.
- **`scripts/build-guides.ts`**: The build script that parses guides, generates embeddings, and updates the LanceDB instance.
- **`.mcp-data/`**: The local directory where the LanceDB vector store is persisted (gitignored).
- **`AGENTS.md`**: Operational instruction file for AI agents.
