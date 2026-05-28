import "dotenv/config";

export { ShopifyClient } from "./shopify/client.js";
export type {
  ShopifyConfig,
  ShopifyProduct,
  ShopifyVariant,
  ShopifyOrder,
  ShopifyCustomer,
} from "./shopify/client.js";

export { AIClient } from "./ai/client.js";
export type { AIClientOptions, AIModel } from "./ai/client.js";

export { ProductOptimizer } from "./tools/product-optimizer.js";
export type { ProductOptimizationResult } from "./tools/product-optimizer.js";

export { InventoryAnalyzer } from "./tools/inventory-analyzer.js";
export type { InventoryReport, InventoryAlert } from "./tools/inventory-analyzer.js";

export { CustomerInsights } from "./tools/customer-insights.js";
export type {
  CustomerInsightsReport,
  CustomerSegment,
} from "./tools/customer-insights.js";

export { OrderAnalyzer } from "./tools/order-analyzer.js";
export type { OrderAnalyticsReport } from "./tools/order-analyzer.js";

export { DiscountRecommender } from "./tools/discount-recommender.js";
export type { DiscountRecommendation } from "./tools/discount-recommender.js";

export { ShopifyAIToolkit } from "./toolkit.js";
