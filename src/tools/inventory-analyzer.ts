import { AIClient } from "../ai/client.js";
import { ShopifyClient, ShopifyProduct, ShopifyVariant } from "../shopify/client.js";

export interface InventoryAlert {
  productId: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  sku: string;
  currentStock: number;
  severity: "critical" | "warning" | "ok";
  recommendation: string;
}

export interface InventoryReport {
  generatedAt: string;
  totalProducts: number;
  criticalAlerts: InventoryAlert[];
  warnings: InventoryAlert[];
  aiInsights: string;
  reorderRecommendations: string[];
}

const SYSTEM_PROMPT = `You are an inventory management expert for e-commerce stores.
Analyze inventory data and provide actionable insights to prevent stockouts and overstock.
Be concise, data-driven, and prioritize high-revenue items.`;

export class InventoryAnalyzer {
  constructor(
    private shopify: ShopifyClient,
    private ai: AIClient
  ) {}

  async generateReport(): Promise<InventoryReport> {
    const products = await this.shopify.getProducts(250);
    const alerts = this.buildAlerts(products);

    const criticalAlerts = alerts.filter((a) => a.severity === "critical");
    const warnings = alerts.filter((a) => a.severity === "warning");

    const aiInsights = await this.getAIInsights(products, alerts);

    return {
      generatedAt: new Date().toISOString(),
      totalProducts: products.length,
      criticalAlerts,
      warnings,
      aiInsights: aiInsights.summary,
      reorderRecommendations: aiInsights.reorderRecommendations,
    };
  }

  private buildAlerts(products: ShopifyProduct[]): InventoryAlert[] {
    const alerts: InventoryAlert[] = [];

    for (const product of products) {
      for (const variant of product.variants) {
        if (!variant.inventory_management) continue;

        const qty = variant.inventory_quantity;
        let severity: InventoryAlert["severity"] = "ok";
        let recommendation = "";

        if (qty <= 0) {
          severity = "critical";
          recommendation = "Out of stock — reorder immediately or mark as unavailable.";
        } else if (qty <= 5) {
          severity = "critical";
          recommendation = `Only ${qty} left — reorder now to avoid stockout.`;
        } else if (qty <= 15) {
          severity = "warning";
          recommendation = `Low stock (${qty} units) — consider reordering soon.`;
        } else {
          severity = "ok";
          recommendation = "Stock level healthy.";
        }

        if (severity !== "ok") {
          alerts.push({
            productId: product.id,
            productTitle: product.title,
            variantId: variant.id,
            variantTitle: variant.title,
            sku: variant.sku,
            currentStock: qty,
            severity,
            recommendation,
          });
        }
      }
    }

    return alerts;
  }

  private async getAIInsights(
    products: ShopifyProduct[],
    alerts: InventoryAlert[]
  ): Promise<{ summary: string; reorderRecommendations: string[] }> {
    const inventorySummary = products
      .flatMap((p) =>
        p.variants.map((v) => ({
          product: p.title,
          variant: v.title,
          sku: v.sku,
          qty: v.inventory_quantity,
          price: v.price,
        }))
      )
      .slice(0, 50);

    const prompt = `Analyze this inventory data for a Shopify store and return JSON:

Total products: ${products.length}
Critical alerts (out of stock / very low): ${alerts.filter((a) => a.severity === "critical").length}
Warnings (low stock): ${alerts.filter((a) => a.severity === "warning").length}

Sample inventory:
${JSON.stringify(inventorySummary, null, 2)}

Return JSON:
{
  "summary": "<2-3 sentence executive summary of inventory health>",
  "reorderRecommendations": ["<specific actionable recommendation>", ...]
}`;

    const response = await this.ai.completeWithCache(SYSTEM_PROMPT, prompt, {
      maxTokens: 1024,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        summary: "Unable to generate AI insights.",
        reorderRecommendations: [],
      };
    }

    return JSON.parse(jsonMatch[0]);
  }
}
