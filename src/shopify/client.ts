import { z } from "zod";

export const ShopifyConfigSchema = z.object({
  storeUrl: z.string().min(1),
  accessToken: z.string().min(1),
});

export type ShopifyConfig = z.infer<typeof ShopifyConfigSchema>;

export interface ShopifyProduct {
  id: string;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  status: string;
  tags: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  sku: string;
  inventory_quantity: number;
  inventory_management: string | null;
}

export interface ShopifyImage {
  id: string;
  src: string;
  alt: string | null;
}

export interface ShopifyOrder {
  id: string;
  name: string;
  email: string;
  created_at: string;
  total_price: string;
  financial_status: string;
  fulfillment_status: string | null;
  line_items: ShopifyLineItem[];
}

export interface ShopifyLineItem {
  id: string;
  title: string;
  quantity: number;
  price: string;
  sku: string;
}

export interface ShopifyCustomer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  total_spent: string;
  tags: string;
  created_at: string;
}

export class ShopifyClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: ShopifyConfig) {
    const validated = ShopifyConfigSchema.parse(config);
    const storeUrl = validated.storeUrl.replace(/^https?:\/\//, "");
    this.baseUrl = `https://${storeUrl}/admin/api/2024-01`;
    this.headers = {
      "X-Shopify-Access-Token": validated.accessToken,
      "Content-Type": "application/json",
    };
  }

  static fromEnv(): ShopifyClient {
    return new ShopifyClient({
      storeUrl: process.env.SHOPIFY_STORE_URL ?? "",
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN ?? "",
    });
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: { ...this.headers, ...options.headers },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Shopify API ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
  }

  async getProducts(limit = 50): Promise<ShopifyProduct[]> {
    const data = await this.request<{ products: ShopifyProduct[] }>(
      `/products.json?limit=${limit}&status=any`
    );
    return data.products;
  }

  async getProduct(id: string): Promise<ShopifyProduct> {
    const data = await this.request<{ product: ShopifyProduct }>(
      `/products/${id}.json`
    );
    return data.product;
  }

  async updateProduct(
    id: string,
    updates: Partial<ShopifyProduct>
  ): Promise<ShopifyProduct> {
    const data = await this.request<{ product: ShopifyProduct }>(
      `/products/${id}.json`,
      {
        method: "PUT",
        body: JSON.stringify({ product: updates }),
      }
    );
    return data.product;
  }

  async getOrders(limit = 50, status = "any"): Promise<ShopifyOrder[]> {
    const data = await this.request<{ orders: ShopifyOrder[] }>(
      `/orders.json?limit=${limit}&status=${status}`
    );
    return data.orders;
  }

  async getCustomers(limit = 50): Promise<ShopifyCustomer[]> {
    const data = await this.request<{ customers: ShopifyCustomer[] }>(
      `/customers.json?limit=${limit}`
    );
    return data.customers;
  }

  async graphql(query: string, variables?: Record<string, unknown>) {
    const res = await fetch(
      `https://${this.baseUrl.replace("https://", "").split("/admin")[0]}/admin/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ query, variables }),
      }
    );

    if (!res.ok) {
      throw new Error(`GraphQL request failed: ${res.statusText}`);
    }

    return res.json();
  }
}
