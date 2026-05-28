const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  return res.json();
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  return res.json();
}

export const api = {
  health: () => get<{ status: string; shopifyConfigured: boolean; aiConfigured: boolean }>("/health"),
  inventory: () => get<InventoryReport>("/inventory"),
  orders: (limit = 250) => get<OrderReport>(`/orders?limit=${limit}`),
  customers: (limit = 100) => get<CustomerReport>(`/customers?limit=${limit}`),
  discounts: () => get<DiscountRec[]>("/discounts"),
  products: () => get<Product[]>("/products"),
  optimizeProduct: (id: string) => post<OptimizeResult>(`/products/${id}/optimize`),
  applyOptimization: (id: string) => post<{ success: boolean }>(`/products/${id}/apply`),
};

export interface InventoryReport {
  generatedAt: string;
  totalProducts: number;
  criticalAlerts: InventoryAlert[];
  warnings: InventoryAlert[];
  aiInsights: string;
  reorderRecommendations: string[];
}

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

export interface OrderReport {
  generatedAt: string;
  period: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  fulfillmentRate: number;
  topProducts: { title: string; quantity: number; revenue: number }[];
  trends: string;
  recommendations: string[];
}

export interface CustomerReport {
  generatedAt: string;
  totalCustomers: number;
  segments: CustomerSegment[];
  topCustomers: { id: string; name: string; email: string; totalSpent: string; ordersCount: number }[];
  retentionInsights: string;
  growthOpportunities: string[];
}

export interface CustomerSegment {
  name: string;
  description: string;
  criteria: string;
  customerCount: number;
  averageOrderValue: number;
  recommendedActions: string[];
}

export interface DiscountRec {
  name: string;
  code: string;
  discountPercent: number;
  targetSegment: string;
  rationale: string;
  suggestedDuration: string;
  expectedImpact: string;
}

export interface Product {
  id: string;
  title: string;
  body_html: string;
  status: string;
  variants: { price: string; inventory_quantity: number }[];
}

export interface OptimizeResult {
  productId: string;
  title: string;
  originalDescription: string;
  optimizedDescription: string;
  suggestedTags: string[];
  seoTitle: string;
  seoDescription: string;
}
