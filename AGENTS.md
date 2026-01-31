# Guidance Project Context for Agents

You are working in the `guidance` monorepo, which defines and evaluates modern web development best practices.

## Project Structure

- **`serving/`**: The Modern Web MCP server.
  - `mcp-server/src/guides/`: **Source of truth for implementation guidance.** Add or edit markdown files here to update what the MCP server knows.
  - `mcp-server/src/data/`: Generated data, including the vector-ready use-case registry.
  - `scripts/`: Utilities for building the vector store and testing search.
- **`evaluator/`**: The "Spike Runner" evaluation suite.
  - `checks/`: Logic for scoring AI-generated code.
  - `setup/`: Templates and scenarios used for testing.

## Operational Rules

1. **Workspaces**: This is a `pnpm` workspace. Always run `pnpm install` from the root.
2. **Updating Guidance**: If you modify files in `serving/mcp-server/src/guides/`, you **MUST** run `pnpm --filter serving run build` to regenerate the vector database (`.mcp-data/`).
3. **Testing**:
   - Serving: `pnpm --filter serving test`.
   - Evaluator: `cd evaluator && pnpm run autorun`.
4. **Instruction Files**: 
   - `AGENTS.md` (this file): Guidance for agents *developing* this repository.
   - `serving/AGENTS.md`: Mandatory operational rules for agents *using* the MCP server in their own workflows.

## Tech Stack

- **Runtime**: Node.js (TypeScript in `serving`, JS in `evaluator`).
- **Database**: LanceDB (Vector store for semantic search).
- **Search**: `@huggingface/transformers` for local embeddings.
- **MCP**: Built with the Model Context Protocol SDK.
