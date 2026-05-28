import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductOptimizer } from "./product-optimizer.js";
import { ShopifyClient } from "../shopify/client.js";
import { AIClient } from "../ai/client.js";

const mockProduct = {
  id: "123",
  title: "Classic T-Shirt",
  body_html: "<p>A t-shirt.</p>",
  vendor: "ACME",
  product_type: "Apparel",
  status: "active",
  tags: "shirt",
  variants: [
    {
      id: "v1",
      title: "S",
      price: "29.99",
      sku: "TS-S",
      inventory_quantity: 10,
      inventory_management: "shopify",
    },
    {
      id: "v2",
      title: "L",
      price: "29.99",
      sku: "TS-L",
      inventory_quantity: 5,
      inventory_management: "shopify",
    },
  ],
  images: [],
};

const aiResponse = JSON.stringify({
  optimizedDescription:
    "<p>Premium classic t-shirt crafted for everyday comfort.</p>",
  suggestedTags: ["t-shirt", "classic", "comfortable", "everyday"],
  seoTitle: "Classic T-Shirt | Premium Everyday Wear",
  seoDescription:
    "Shop our premium classic t-shirt. Comfortable, durable, and stylish for any occasion.",
});

describe("ProductOptimizer", () => {
  let shopify: ShopifyClient;
  let ai: AIClient;
  let optimizer: ProductOptimizer;

  beforeEach(() => {
    shopify = {
      getProduct: vi.fn().mockResolvedValue(mockProduct),
      updateProduct: vi.fn().mockResolvedValue(mockProduct),
    } as unknown as ShopifyClient;

    ai = {
      completeWithCache: vi.fn().mockResolvedValue(aiResponse),
    } as unknown as AIClient;

    optimizer = new ProductOptimizer(shopify, ai);
  });

  it("optimizes a product and returns structured result", async () => {
    const result = await optimizer.optimizeProduct("123");

    expect(result.productId).toBe("123");
    expect(result.title).toBe("Classic T-Shirt");
    expect(result.optimizedDescription.toLowerCase()).toContain("premium");
    expect(result.suggestedTags).toContain("t-shirt");
    expect(result.seoTitle).toBeTruthy();
    expect(result.seoDescription).toBeTruthy();
  });

  it("calls Shopify getProduct with the correct ID", async () => {
    await optimizer.optimizeProduct("123");
    expect(shopify.getProduct).toHaveBeenCalledWith("123");
  });

  it("applies optimization to Shopify when requested", async () => {
    const result = await optimizer.optimizeProduct("123");
    await optimizer.applyOptimization(result);

    expect(shopify.updateProduct).toHaveBeenCalledWith("123", {
      body_html: result.optimizedDescription,
      tags: result.suggestedTags.join(", "),
    });
  });
});
