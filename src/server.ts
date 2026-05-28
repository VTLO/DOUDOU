import "dotenv/config";
import express from "express";
import cors from "cors";
import { ShopifyAIToolkit } from "./toolkit.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3001;

function getToolkit() {
  return ShopifyAIToolkit.fromEnv();
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    shopifyConfigured: !!(
      process.env.SHOPIFY_STORE_URL && process.env.SHOPIFY_ACCESS_TOKEN
    ),
    aiConfigured: !!process.env.ANTHROPIC_API_KEY,
  });
});

app.get("/api/inventory", async (_req, res) => {
  try {
    const report = await getToolkit().inventory.generateReport();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "250"));
    const report = await getToolkit().orders.generateReport(limit);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "100"));
    const report = await getToolkit().customers.generateReport(limit);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/discounts", async (_req, res) => {
  try {
    const recs = await getToolkit().discounts.getRecommendations();
    res.json(recs);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/products", async (_req, res) => {
  try {
    const products = await getToolkit().shopify.getProducts(50);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/api/products/:id/optimize", async (req, res) => {
  try {
    const result = await getToolkit().products.optimizeProduct(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/api/products/:id/apply", async (req, res) => {
  try {
    const toolkit = getToolkit();
    const result = await toolkit.products.optimizeProduct(req.params.id);
    await toolkit.products.applyOptimization(result);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Shopify ia API running on http://localhost:${PORT}`);
});
