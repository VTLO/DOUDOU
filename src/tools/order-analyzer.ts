import { AIClient } from "../ai/client.js";
import { ShopifyClient, ShopifyOrder } from "../shopify/client.js";

export interface OrderAnalyticsReport {
  generatedAt: string;
  period: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  fulfillmentRate: number;
  topProducts: Array<{ title: string; quantity: number; revenue: number }>;
  trends: string;
  recommendations: string[];
}

const SYSTEM_PROMPT = `You are an e-commerce analytics expert.
Analyze order data to identify trends, performance issues, and revenue opportunities.
Be specific and data-driven. Return valid JSON only.`;

export class OrderAnalyzer {
  constructor(
    private shopify: ShopifyClient,
    private ai: AIClient
  ) {}

  async generateReport(limit = 250): Promise<OrderAnalyticsReport> {
    const orders = await this.shopify.getOrders(limit);
    const metrics = this.computeMetrics(orders);
    const aiAnalysis = await this.analyzeWithAI(orders, metrics);

    return {
      generatedAt: new Date().toISOString(),
      period: `Last ${orders.length} orders`,
      totalOrders: orders.length,
      totalRevenue: metrics.totalRevenue,
      averageOrderValue: metrics.averageOrderValue,
      fulfillmentRate: metrics.fulfillmentRate,
      topProducts: metrics.topProducts.slice(0, 10),
      trends: aiAnalysis.trends,
      recommendations: aiAnalysis.recommendations,
    };
  }

  private computeMetrics(orders: ShopifyOrder[]) {
    const totalRevenue = orders.reduce(
      (sum, o) => sum + parseFloat(o.total_price),
      0
    );
    const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;

    const fulfilled = orders.filter(
      (o) => o.fulfillment_status === "fulfilled"
    ).length;
    const fulfillmentRate = orders.length ? (fulfilled / orders.length) * 100 : 0;

    const productMap = new Map<
      string,
      { quantity: number; revenue: number }
    >();

    for (const order of orders) {
      for (const item of order.line_items) {
        const key = item.title;
        const existing = productMap.get(key) ?? { quantity: 0, revenue: 0 };
        productMap.set(key, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + parseFloat(item.price) * item.quantity,
        });
      }
    }

    const topProducts = Array.from(productMap.entries())
      .map(([title, stats]) => ({ title, ...stats }))
      .sort((a, b) => b.revenue - a.revenue);

    return { totalRevenue, averageOrderValue, fulfillmentRate, topProducts };
  }

  private async analyzeWithAI(
    orders: ShopifyOrder[],
    metrics: ReturnType<typeof this.computeMetrics>
  ) {
    const recentOrders = orders.slice(0, 30).map((o) => ({
      date: o.created_at.substring(0, 10),
      total: o.total_price,
      status: o.financial_status,
      fulfillment: o.fulfillment_status,
      items: o.line_items.length,
    }));

    const prompt = `Analyze this Shopify order data and return JSON:

Total orders: ${orders.length}
Total revenue: $${metrics.totalRevenue.toFixed(2)}
Average order value: $${metrics.averageOrderValue.toFixed(2)}
Fulfillment rate: ${metrics.fulfillmentRate.toFixed(1)}%

Top 5 products by revenue:
${JSON.stringify(metrics.topProducts.slice(0, 5), null, 2)}

Recent 30 orders:
${JSON.stringify(recentOrders, null, 2)}

Return JSON:
{
  "trends": "<2-3 sentences describing key order trends>",
  "recommendations": ["<specific actionable recommendation>", ...]
}`;

    const response = await this.ai.completeWithCache(SYSTEM_PROMPT, prompt, {
      maxTokens: 1024,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { trends: "Unable to generate analysis.", recommendations: [] };
    }

    return JSON.parse(jsonMatch[0]);
  }
}
