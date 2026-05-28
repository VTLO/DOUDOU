import { ShopifyClient, ShopifyConfig } from "./shopify/client.js";
import { AIClient, AIClientOptions } from "./ai/client.js";
import { ProductOptimizer } from "./tools/product-optimizer.js";
import { InventoryAnalyzer } from "./tools/inventory-analyzer.js";
import { CustomerInsights } from "./tools/customer-insights.js";
import { OrderAnalyzer } from "./tools/order-analyzer.js";
import { DiscountRecommender } from "./tools/discount-recommender.js";

export interface ToolkitConfig {
  shopify: ShopifyConfig;
  ai?: AIClientOptions;
}

export class ShopifyAIToolkit {
  readonly shopify: ShopifyClient;
  readonly ai: AIClient;
  readonly products: ProductOptimizer;
  readonly inventory: InventoryAnalyzer;
  readonly customers: CustomerInsights;
  readonly orders: OrderAnalyzer;
  readonly discounts: DiscountRecommender;

  constructor(config: ToolkitConfig) {
    this.shopify = new ShopifyClient(config.shopify);
    this.ai = new AIClient(config.ai);

    this.products = new ProductOptimizer(this.shopify, this.ai);
    this.inventory = new InventoryAnalyzer(this.shopify, this.ai);
    this.customers = new CustomerInsights(this.shopify, this.ai);
    this.orders = new OrderAnalyzer(this.shopify, this.ai);
    this.discounts = new DiscountRecommender(this.shopify, this.ai);
  }

  static fromEnv(): ShopifyAIToolkit {
    return new ShopifyAIToolkit({
      shopify: {
        storeUrl: process.env.SHOPIFY_STORE_URL ?? "",
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN ?? "",
      },
      ai: {
        apiKey: process.env.ANTHROPIC_API_KEY,
      },
    });
  }
}
