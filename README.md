# Shopify ia

Boîte à outils basée sur l'IA pour la gestion des boutiques Shopify utilisant Claude. Optimisez les fiches produits, analysez les stocks, comprenez vos clients et obtenez des modèles de recommandations de remises intelligents. Le tout grâce à Claude d'Anthropic.

## Fonctionnalités

**Optimiseur de produits** Descriptions de produits réécrites par l'IA, titres SEO et suggestions de balises

**Analyseur de stocks** Alertes de stock avec recommandations de réapprovisionnement générées par l'IA

**Informations sur les clients** - Segmentation, analyse de la fidélisation et opportunités de croissance

**Analyseur de commandes** et informations sur les performances Tendances des revenus, meilleurs produits,

**Recommandateur de remises** Suggestions de campagnes ciblées avec impact attendu

## Configuration

`bash

npm install

cp.env.example.env

# Renseignez SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN,

ANTHROPIC_API_KEY

## Utilisation de l'interface de ligne de commande

`bash

# Vérification de l'état des stocks

npm run cli inventory

№€#€#€

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
import { ShopifyAIToolkit } from "shopify-ia";

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
