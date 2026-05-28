import { describe, it, expect } from "vitest";
import { ShopifyAIToolkit } from "./toolkit.js";

describe("ShopifyAIToolkit", () => {
  it("instantiates all tools correctly", () => {
    const toolkit = new ShopifyAIToolkit({
      shopify: {
        storeUrl: "test.myshopify.com",
        accessToken: "shpat_test_token",
      },
      ai: { apiKey: "sk-ant-test" },
    });

    expect(toolkit.shopify).toBeDefined();
    expect(toolkit.ai).toBeDefined();
    expect(toolkit.products).toBeDefined();
    expect(toolkit.inventory).toBeDefined();
    expect(toolkit.customers).toBeDefined();
    expect(toolkit.orders).toBeDefined();
    expect(toolkit.discounts).toBeDefined();
  });
});
