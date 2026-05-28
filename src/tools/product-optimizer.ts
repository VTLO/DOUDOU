import { AIClient } from "../ai/client.js";
import { ShopifyClient, ShopifyProduct } from "../shopify/client.js";

export interface ProductOptimizationResult {
  productId: string;
  title: string;
  originalDescription: string;
  optimizedDescription: string;
  suggestedTags: string[];
  seoTitle: string;
  seoDescription: string;
}

const SYSTEM_PROMPT = `You are an expert Shopify store copywriter and SEO specialist.
Your job is to optimize product listings to increase conversion rates and search visibility.
Always respond with valid JSON matching the requested schema. Be specific, engaging, and accurate.`;

export class ProductOptimizer {
  constructor(
    private shopify: ShopifyClient,
    private ai: AIClient
  ) {}

  async optimizeProduct(
    productId: string
  ): Promise<ProductOptimizationResult> {
    const product = await this.shopify.getProduct(productId);
    return this.analyzeProduct(product);
  }

  async optimizeAllProducts(
    limit = 10
  ): Promise<ProductOptimizationResult[]> {
    const products = await this.shopify.getProducts(limit);
    const results: ProductOptimizationResult[] = [];

    for (const product of products) {
      const result = await this.analyzeProduct(product);
      results.push(result);
    }

    return results;
  }

  async applyOptimization(
    result: ProductOptimizationResult
  ): Promise<ShopifyProduct> {
    return this.shopify.updateProduct(result.productId, {
      body_html: result.optimizedDescription,
      tags: result.suggestedTags.join(", "),
    });
  }

  private async analyzeProduct(
    product: ShopifyProduct
  ): Promise<ProductOptimizationResult> {
    const prompt = `Optimize this Shopify product listing and return a JSON object:

Product: ${product.title}
Current description: ${product.body_html || "(none)"}
Vendor: ${product.vendor}
Type: ${product.product_type}
Current tags: ${product.tags}
Price range: $${Math.min(...product.variants.map((v) => parseFloat(v.price)))} - $${Math.max(...product.variants.map((v) => parseFloat(v.price)))}

Return JSON with this exact shape:
{
  "optimizedDescription": "<HTML description with engaging copy, benefits, and key features>",
  "suggestedTags": ["tag1", "tag2", ...],
  "seoTitle": "<60 char max SEO title>",
  "seoDescription": "<160 char max meta description>"
}`;

    const response = await this.ai.completeWithCache(SYSTEM_PROMPT, prompt);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      productId: product.id,
      title: product.title,
      originalDescription: product.body_html,
      optimizedDescription: parsed.optimizedDescription,
      suggestedTags: parsed.suggestedTags,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
    };
  }
}
