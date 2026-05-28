import { AIClient } from "../ai/client.js";
import { ShopifyClient, ShopifyCustomer } from "../shopify/client.js";

export interface CustomerSegment {
  name: string;
  description: string;
  criteria: string;
  customerCount: number;
  averageOrderValue: number;
  recommendedActions: string[];
}

export interface CustomerInsightsReport {
  generatedAt: string;
  totalCustomers: number;
  segments: CustomerSegment[];
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    totalSpent: string;
    ordersCount: number;
  }>;
  retentionInsights: string;
  growthOpportunities: string[];
}

const SYSTEM_PROMPT = `You are a customer analytics expert specializing in e-commerce.
Analyze customer data to identify segments, retention opportunities, and growth strategies.
Focus on actionable, revenue-driving insights. Return valid JSON only.`;

export class CustomerInsights {
  constructor(
    private shopify: ShopifyClient,
    private ai: AIClient
  ) {}

  async generateReport(limit = 100): Promise<CustomerInsightsReport> {
    const customers = await this.shopify.getCustomers(limit);
    const topCustomers = this.getTopCustomers(customers, 10);
    const aiReport = await this.analyzeWithAI(customers);

    return {
      generatedAt: new Date().toISOString(),
      totalCustomers: customers.length,
      segments: aiReport.segments,
      topCustomers,
      retentionInsights: aiReport.retentionInsights,
      growthOpportunities: aiReport.growthOpportunities,
    };
  }

  private getTopCustomers(customers: ShopifyCustomer[], limit: number) {
    return customers
      .sort((a, b) => parseFloat(b.total_spent) - parseFloat(a.total_spent))
      .slice(0, limit)
      .map((c) => ({
        id: c.id,
        name: `${c.first_name} ${c.last_name}`.trim(),
        email: c.email,
        totalSpent: c.total_spent,
        ordersCount: c.orders_count,
      }));
  }

  private async analyzeWithAI(customers: ShopifyCustomer[]) {
    const stats = this.computeStats(customers);

    const prompt = `Analyze this Shopify customer data and return a JSON report:

Total customers: ${customers.length}
Average order count: ${stats.avgOrders.toFixed(1)}
Average total spent: $${stats.avgSpent.toFixed(2)}
Customers with 0 orders: ${stats.zeroOrders}
Customers with 1 order: ${stats.oneOrder}
Customers with 2+ orders: ${stats.repeatCustomers}
Highest spender: $${stats.maxSpent.toFixed(2)}

Sample customers (first 20):
${JSON.stringify(
  customers.slice(0, 20).map((c) => ({
    orders: c.orders_count,
    spent: c.total_spent,
    tags: c.tags,
    since: c.created_at.substring(0, 10),
  })),
  null,
  2
)}

Return JSON:
{
  "segments": [
    {
      "name": "<segment name>",
      "description": "<what defines this segment>",
      "criteria": "<data criteria>",
      "customerCount": <number>,
      "averageOrderValue": <number>,
      "recommendedActions": ["<action>", ...]
    }
  ],
  "retentionInsights": "<paragraph on retention opportunities>",
  "growthOpportunities": ["<specific growth action>", ...]
}`;

    const response = await this.ai.completeWithCache(SYSTEM_PROMPT, prompt, {
      maxTokens: 2048,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        segments: [],
        retentionInsights: "Unable to generate insights.",
        growthOpportunities: [],
      };
    }

    return JSON.parse(jsonMatch[0]);
  }

  private computeStats(customers: ShopifyCustomer[]) {
    const spends = customers.map((c) => parseFloat(c.total_spent));
    const orders = customers.map((c) => c.orders_count);

    return {
      avgSpent: spends.reduce((a, b) => a + b, 0) / customers.length,
      avgOrders: orders.reduce((a, b) => a + b, 0) / customers.length,
      maxSpent: Math.max(...spends),
      zeroOrders: orders.filter((o) => o === 0).length,
      oneOrder: orders.filter((o) => o === 1).length,
      repeatCustomers: orders.filter((o) => o >= 2).length,
    };
  }
}
