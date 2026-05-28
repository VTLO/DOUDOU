# Shopify AI Toolkit

AI-powered toolkit for Shopify store management using Claude. Optimize product listings, analyze inventory, understand customers, and get smart discount recommendations — all powered by Anthropic's Claude models.

## Features

- **Product Optimizer** — AI-rewritten product descriptions, SEO titles, and tag suggestions
- **Inventory Analyzer** — Stock alerts with AI-generated reorder recommendations
- **Customer Insights** — Segmentation, retention analysis, and growth opportunities
- **Order Analyzer** — Revenue trends, top products, and performance insights
- **Discount Recommender** — Targeted campaign suggestions with expected impact

## Setup

```bash
npm install
cp .env.example .env
# Fill in SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN, ANTHROPIC_API_KEY
```

## CLI Usage

```bash
# Inventory health check
npm run cli -- inventory

# Order analytics (last 250 orders)
npm run cli -- orders --limit 250

# Customer segmentation
npm run cli -- customers --limit 100

# Optimize a product (preview only)
npm run cli -- optimize-product <product-id>

# Optimize and apply to store
npm run cli -- optimize-product <product-id> --apply

# Discount campaign recommendations
npm run cli -- discounts
```

## Programmatic Usage

```typescript
import { ShopifyAIToolkit } from "@shopify/shopify-ai-toolkit";

const toolkit = ShopifyAIToolkit.fromEnv();

// Inventory report
const inventory = await toolkit.inventory.generateReport();
console.log(inventory.criticalAlerts);

// Order analytics
const orders = await toolkit.orders.generateReport(100);
console.log(orders.trends);

// Customer insights
const customers = await toolkit.customers.generateReport();
console.log(customers.segments);

// Optimize a product
const result = await toolkit.products.optimizeProduct("gid://shopify/Product/123");
await toolkit.products.applyOptimization(result); // save to store
```

## Environment Variables

| Variable | Description |
|---|---|
| `SHOPIFY_STORE_URL` | Your store URL (e.g. `my-store.myshopify.com`) |
| `SHOPIFY_ACCESS_TOKEN` | Shopify Admin API access token |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `CLAUDE_MODEL` | Claude model (default: `claude-opus-4-7`) |

## Development

```bash
npm run build     # Compile TypeScript
npm test          # Run tests
npm run typecheck # Type-check without building
```

## License

MIT
