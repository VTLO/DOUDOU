# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`shopify-ia` is an AI-powered toolkit for Shopify store management. It exposes five analysis/optimization tools (products, inventory, customers, orders, discounts) both as a CLI and as a programmatic TypeScript library. All AI work goes through Anthropic's Claude models via `@anthropic-ai/sdk`.

## Commands

```bash
npm install           # Install dependencies
npm run build         # Compile TypeScript → dist/
npm run typecheck     # Type-check without emitting files
npm test              # Run all tests (Vitest)
npm run lint          # ESLint over src/
```

Run a single test file:
```bash
npx vitest run src/tools/inventory-analyzer.test.ts
```

Run the CLI in development (no build needed):
```bash
npm run cli -- inventory
npm run cli -- orders --limit 250
npm run cli -- customers --limit 100
npm run cli -- optimize-product <product-id>
npm run cli -- optimize-product <product-id> --apply
npm run cli -- discounts
```

Requires a `.env` file (copy from `.env.example`) with `SHOPIFY_STORE_URL`, `SHOPIFY_ACCESS_TOKEN`, and `ANTHROPIC_API_KEY`.

## Architecture

The codebase is layered: two clients at the base, five tool classes in the middle, and a facade + CLI on top.

```
src/
├── shopify/client.ts   — ShopifyClient: Shopify Admin REST API (2024-01) + raw GraphQL
├── ai/client.ts        — AIClient: thin @anthropic-ai/sdk wrapper
├── tools/              — Five tools, each takes (shopify, ai) in constructor
│   ├── product-optimizer.ts
│   ├── inventory-analyzer.ts
│   ├── customer-insights.ts
│   ├── order-analyzer.ts
│   └── discount-recommender.ts
├── toolkit.ts          — ShopifyAIToolkit: wires clients + tools, fromEnv() factory
├── cli.ts              — Commander CLI exposing all five tools as subcommands
└── index.ts            — Public re-export surface (library entrypoint)
```

**`ShopifyClient`** (`src/shopify/client.ts`) validates config with Zod and wraps the REST API. The `graphql()` method is an escape hatch for resources not covered by the typed REST methods. Shopify API version is pinned to `2024-01`.

**`AIClient`** (`src/ai/client.ts`) has three call modes:
- `complete()` — basic single-turn call
- `completeWithCache()` — sends the system prompt with `cache_control: { type: "ephemeral" }` for prompt caching; **this is what all five tools use**
- `streamComplete()` — streaming with a per-chunk callback

**Tool classes** each follow the same pattern: fetch data from `ShopifyClient`, do deterministic preprocessing (e.g. alert classification in `InventoryAnalyzer`), then call `ai.completeWithCache()` with a structured JSON prompt. AI responses are extracted with `/\{[\s\S]*\}/` regex and parsed with `JSON.parse()`.

**`ShopifyAIToolkit`** (`src/toolkit.ts`) is the public facade — it instantiates everything and exposes the five tools as named properties (`toolkit.products`, `toolkit.inventory`, etc.). `ShopifyAIToolkit.fromEnv()` reads credentials from environment variables.

## Key Conventions

**ESM imports**: All imports must use `.js` extensions (e.g. `import { Foo } from "./foo.js"`), even for `.ts` source files. This is required by the `"type": "module"` + `moduleResolution: "bundler"` setup.

**AI response format**: All tools ask Claude to return JSON in a specific shape and parse it with a regex + `JSON.parse`. If the regex fails to find `{}`, the tools either throw or return a fallback — follow this same pattern when adding new tools.

**Prefer `completeWithCache()`**: Use `ai.completeWithCache()` rather than `ai.complete()` for all tool calls so that stable system prompts benefit from prompt caching.

**Testing**: Tests mock both `ShopifyClient` and `AIClient` using Vitest's `vi.fn()` — no real API calls are made. The AI mock returns a raw JSON string that the tool under test will parse. Use `as unknown as ShopifyClient` casting to satisfy the constructor types when passing partial mocks.

**Product IDs**: The REST `getProduct(id)` method interpolates the id directly into `/products/${id}.json`, so it expects a plain numeric ID (e.g. `"123"`), not a GID (`gid://shopify/Product/123`). The programmatic example in the README uses GID format, which would fail against the REST client — use numeric IDs with the current implementation.
