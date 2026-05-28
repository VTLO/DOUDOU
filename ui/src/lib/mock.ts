import type { InventoryReport, OrderReport, CustomerReport, DiscountRec, Product } from "./api.ts";

export const mockInventory: InventoryReport = {
  generatedAt: new Date().toISOString(),
  totalProducts: 48,
  criticalAlerts: [
    { productId: "1", productTitle: "Classic Crew Tee", variantId: "v1", variantTitle: "Black / XL", sku: "CCT-BLK-XL", currentStock: 0, severity: "critical", recommendation: "Out of stock — reorder immediately." },
    { productId: "2", productTitle: "Slim Fit Chinos", variantId: "v2", variantTitle: "Navy / 32", sku: "SFC-NVY-32", currentStock: 2, severity: "critical", recommendation: "Only 2 left — reorder now." },
    { productId: "3", productTitle: "Canvas Tote Bag", variantId: "v3", variantTitle: "Natural", sku: "CTB-NAT", currentStock: 4, severity: "critical", recommendation: "Only 4 left — reorder now." },
  ],
  warnings: [
    { productId: "4", productTitle: "Merino Wool Sweater", variantId: "v4", variantTitle: "Oatmeal / M", sku: "MWS-OAT-M", currentStock: 8, severity: "warning", recommendation: "Low stock — consider reordering." },
    { productId: "5", productTitle: "Leather Belt", variantId: "v5", variantTitle: "Brown / 34", sku: "LB-BRN-34", currentStock: 11, severity: "warning", recommendation: "Low stock — consider reordering." },
  ],
  aiInsights: "3 products are critically low or out of stock, including your best-seller Classic Crew Tee. Immediate reordering is recommended. 2 additional items are approaching warning thresholds — plan your next inventory run to cover these.",
  reorderRecommendations: [
    "Reorder Classic Crew Tee (Black/XL) immediately — high sell-through velocity.",
    "Bundle Slim Fit Chinos reorder with upcoming seasonal line to save on shipping.",
    "Consider increasing Canvas Tote Bag safety stock — Q4 demand typically spikes.",
  ],
};

export const mockOrders: OrderReport = {
  generatedAt: new Date().toISOString(),
  period: "Last 250 orders",
  totalOrders: 248,
  totalRevenue: 31640.5,
  averageOrderValue: 127.58,
  fulfillmentRate: 94.4,
  topProducts: [
    { title: "Classic Crew Tee", quantity: 87, revenue: 2523.0 },
    { title: "Slim Fit Chinos", quantity: 62, revenue: 4898.0 },
    { title: "Merino Wool Sweater", quantity: 54, revenue: 5346.0 },
    { title: "Canvas Tote Bag", quantity: 49, revenue: 1274.0 },
    { title: "Leather Belt", quantity: 38, revenue: 1520.0 },
  ],
  trends: "Revenue has grown 18% over the last 30 days, driven primarily by the Merino Wool Sweater and Slim Fit Chinos. Average order value is up $12 compared to the prior period, suggesting upsell strategies are working. Fulfillment rate dipped to 94.4% — investigate the 5.6% unfulfilled orders.",
  recommendations: [
    "Investigate 14 unfulfilled orders — likely tied to the Classic Crew Tee stockout.",
    "Add a product bundle pairing the Sweater + Chinos to capitalize on frequent co-purchase behavior.",
    "Run a retargeting campaign for cart abandoners in the $120–$150 AOV bracket.",
  ],
};

export const mockCustomers: CustomerReport = {
  generatedAt: new Date().toISOString(),
  totalCustomers: 892,
  segments: [
    { name: "VIP Champions", description: "High-spend repeat buyers", criteria: "3+ orders, $300+ total spend", customerCount: 74, averageOrderValue: 198, recommendedActions: ["Early access to new drops", "Exclusive loyalty rewards", "Personal thank-you email"] },
    { name: "Loyal Regulars", description: "Consistent 2-order customers", criteria: "2 orders, $100–$300 spend", customerCount: 201, averageOrderValue: 142, recommendedActions: ["Win-back sequence if 60+ days inactive", "Cross-sell based on past purchases"] },
    { name: "One-Time Buyers", description: "Single purchase, not returned", criteria: "Exactly 1 order", customerCount: 512, averageOrderValue: 89, recommendedActions: ["30-day follow-up discount code", "Post-purchase review request", "Similar product recommendations"] },
    { name: "At Risk", description: "Previously active, now dormant", criteria: "2+ orders, 90+ days inactive", customerCount: 105, averageOrderValue: 156, recommendedActions: ["Re-engagement email with 15% off", "Survey to understand drop-off"] },
  ],
  topCustomers: [
    { id: "c1", name: "Sophie Martin", email: "sophie@example.com", totalSpent: "1248.00", ordersCount: 9 },
    { id: "c2", name: "James Liu", email: "james@example.com", totalSpent: "986.50", ordersCount: 7 },
    { id: "c3", name: "Emma Wilson", email: "emma@example.com", totalSpent: "874.00", ordersCount: 6 },
    { id: "c4", name: "Noah Garcia", email: "noah@example.com", totalSpent: "762.00", ordersCount: 5 },
    { id: "c5", name: "Olivia Brown", email: "olivia@example.com", totalSpent: "698.00", ordersCount: 5 },
  ],
  retentionInsights: "57% of customers have made only one purchase — this is the largest retention opportunity. Converting just 10% of one-time buyers into repeat customers would add ~$45K in annualized revenue. The At Risk segment (105 customers) represents $16K in recoverable spend.",
  growthOpportunities: [
    "Launch a 'Second Purchase' automated email flow for new buyers at day 21",
    "Create a referral program for VIP Champions — they have the highest NPS potential",
    "A/B test a loyalty points program vs. flat discount for one-time buyer reactivation",
  ],
};

export const mockDiscounts: DiscountRec[] = [
  { name: "Win-Back Campaign", code: "COMEBACK15", discountPercent: 15, targetSegment: "One-time buyers inactive 30+ days", rationale: "Low activation cost to convert the largest customer segment", suggestedDuration: "14 days", expectedImpact: "Est. 8–12% reactivation rate, ~$4,200 incremental revenue" },
  { name: "VIP Early Access", code: "VIP20", discountPercent: 20, targetSegment: "VIP Champions (74 customers)", rationale: "Reward top spenders, increase purchase frequency", suggestedDuration: "48 hours (flash)", expectedImpact: "Est. 35% uptake, ~$5,100 revenue in 48 hrs" },
  { name: "Bundle Booster", code: "BUNDLE10", discountPercent: 10, targetSegment: "All customers — cart value $150+", rationale: "Nudge mid-value carts over AOV threshold", suggestedDuration: "7 days", expectedImpact: "Est. +$18 AOV lift, ~$2,800 total uplift" },
  { name: "Re-Engagement Offer", code: "MISSYOU20", discountPercent: 20, targetSegment: "At-Risk customers (90+ days inactive)", rationale: "Last-chance recovery before permanent churn", suggestedDuration: "10 days", expectedImpact: "Est. 12–18% recovery, ~$1,900 recovered revenue" },
];

export const mockProducts: Product[] = [
  { id: "p1", title: "Classic Crew Tee", body_html: "<p>A comfortable everyday t-shirt.</p>", status: "active", variants: [{ price: "29.00", inventory_quantity: 0 }] },
  { id: "p2", title: "Slim Fit Chinos", body_html: "<p>Slim fit chino trousers.</p>", status: "active", variants: [{ price: "79.00", inventory_quantity: 2 }] },
  { id: "p3", title: "Merino Wool Sweater", body_html: "<p>Premium merino wool sweater.</p>", status: "active", variants: [{ price: "99.00", inventory_quantity: 8 }] },
  { id: "p4", title: "Canvas Tote Bag", body_html: "<p>Durable canvas tote bag.</p>", status: "active", variants: [{ price: "26.00", inventory_quantity: 4 }] },
  { id: "p5", title: "Leather Belt", body_html: "<p>Full-grain leather belt.</p>", status: "active", variants: [{ price: "40.00", inventory_quantity: 11 }] },
];

export const revenueChartData = [
  { day: "May 1", revenue: 980 },
  { day: "May 5", revenue: 1240 },
  { day: "May 9", revenue: 1090 },
  { day: "May 13", revenue: 1560 },
  { day: "May 17", revenue: 1320 },
  { day: "May 21", revenue: 1780 },
  { day: "May 25", revenue: 2100 },
  { day: "May 28", revenue: 1890 },
];
