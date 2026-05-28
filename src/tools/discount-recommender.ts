import { AIClient } from "../ai/client.js";
import { ShopifyClient } from "../shopify/client.js";

export interface DiscountRecommendation {
  name: string;
  code: string;
  discountPercent: number;
  targetSegment: string;
  rationale: string;
  suggestedDuration: string;
  expectedImpact: string;
}

const SYSTEM_PROMPT = `You are a promotional strategy expert for e-commerce.
Recommend targeted discount campaigns that maximize revenue while protecting margins.
Be specific about targeting and expected outcomes. Return valid JSON only.`;

export class DiscountRecommender {
  constructor(
    private shopify: ShopifyClient,
    private ai: AIClient
  ) {}

  async getRecommendations(): Promise<DiscountRecommendation[]> {
    const [products, orders, customers] = await Promise.all([
      this.shopify.getProducts(50),
      this.shopify.getOrders(100),
      this.shopify.getCustomers(100),
    ]);

    const storeStats = {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.status === "active").length,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      avgOrderValue:
        orders.reduce((s, o) => s + parseFloat(o.total_price), 0) /
        (orders.length || 1),
      repeatCustomers: customers.filter((c) => c.orders_count >= 2).length,
      avgSpent:
        customers.reduce((s, c) => s + parseFloat(c.total_spent), 0) /
        (customers.length || 1),
    };

    const prompt = `Design targeted discount campaigns for this Shopify store and return JSON:

Store stats:
${JSON.stringify(storeStats, null, 2)}

Return JSON array of 3-5 discount recommendations:
[
  {
    "name": "<campaign name>",
    "code": "<UPPERCASE_CODE>",
    "discountPercent": <10-30>,
    "targetSegment": "<who this targets>",
    "rationale": "<why this discount makes sense>",
    "suggestedDuration": "<e.g. 7 days, 2 weeks>",
    "expectedImpact": "<expected outcome in 1 sentence>"
  }
]`;

    const response = await this.ai.completeWithCache(SYSTEM_PROMPT, prompt, {
      maxTokens: 2048,
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    return JSON.parse(jsonMatch[0]);
  }
}
