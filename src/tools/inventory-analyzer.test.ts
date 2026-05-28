import { describe, it, expect, vi, beforeEach } from "vitest";
import { InventoryAnalyzer } from "./inventory-analyzer.js";
import { ShopifyClient } from "../shopify/client.js";
import { AIClient } from "../ai/client.js";

const mockProducts = [
  {
    id: "1",
    title: "Out of Stock Item",
    body_html: "",
    vendor: "V",
    product_type: "T",
    status: "active",
    tags: "",
    images: [],
    variants: [
      {
        id: "v1",
        title: "Default",
        price: "20.00",
        sku: "OOS-1",
        inventory_quantity: 0,
        inventory_management: "shopify",
      },
    ],
  },
  {
    id: "2",
    title: "Low Stock Item",
    body_html: "",
    vendor: "V",
    product_type: "T",
    status: "active",
    tags: "",
    images: [],
    variants: [
      {
        id: "v2",
        title: "Default",
        price: "30.00",
        sku: "LOW-1",
        inventory_quantity: 3,
        inventory_management: "shopify",
      },
    ],
  },
  {
    id: "3",
    title: "Healthy Stock Item",
    body_html: "",
    vendor: "V",
    product_type: "T",
    status: "active",
    tags: "",
    images: [],
    variants: [
      {
        id: "v3",
        title: "Default",
        price: "50.00",
        sku: "OK-1",
        inventory_quantity: 100,
        inventory_management: "shopify",
      },
    ],
  },
];

describe("InventoryAnalyzer", () => {
  let analyzer: InventoryAnalyzer;

  beforeEach(() => {
    const shopify = {
      getProducts: vi.fn().mockResolvedValue(mockProducts),
    } as unknown as ShopifyClient;

    const ai = {
      completeWithCache: vi.fn().mockResolvedValue(
        JSON.stringify({
          summary: "Two items need immediate attention.",
          reorderRecommendations: ["Reorder Out of Stock Item immediately"],
        })
      ),
    } as unknown as AIClient;

    analyzer = new InventoryAnalyzer(shopify, ai);
  });

  it("generates a report with correct alert counts", async () => {
    const report = await analyzer.generateReport();

    expect(report.totalProducts).toBe(3);
    expect(report.criticalAlerts).toHaveLength(2);
    expect(report.warnings).toHaveLength(0);
  });

  it("marks out-of-stock items as critical", async () => {
    const report = await analyzer.generateReport();
    const outOfStock = report.criticalAlerts.find(
      (a) => a.sku === "OOS-1"
    );

    expect(outOfStock).toBeDefined();
    expect(outOfStock?.severity).toBe("critical");
    expect(outOfStock?.currentStock).toBe(0);
  });

  it("includes AI insights in the report", async () => {
    const report = await analyzer.generateReport();
    expect(report.aiInsights).toContain("attention");
    expect(report.reorderRecommendations).toHaveLength(1);
  });
});
