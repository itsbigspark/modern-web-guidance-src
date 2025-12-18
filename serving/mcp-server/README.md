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
