#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ShopifyAIToolkit } from "./toolkit.js";

const program = new Command();

program
  .name("shopify-ai")
  .description("AI-powered toolkit for Shopify store management")
  .version("0.1.0");

function getToolkit() {
  return ShopifyAIToolkit.fromEnv();
}

program
  .command("inventory")
  .description("Analyze store inventory and get AI-powered reorder recommendations")
  .action(async () => {
    const spinner = ora("Fetching inventory data...").start();
    try {
      const toolkit = getToolkit();
      const report = await toolkit.inventory.generateReport();
      spinner.succeed("Inventory analysis complete");

      console.log("\n" + chalk.bold("=== Inventory Report ==="));
      console.log(`Total products: ${report.totalProducts}`);
      console.log(
        chalk.red(`Critical alerts: ${report.criticalAlerts.length}`)
      );
      console.log(chalk.yellow(`Warnings: ${report.warnings.length}`));

      if (report.criticalAlerts.length > 0) {
        console.log("\n" + chalk.red.bold("CRITICAL (Out of Stock / Very Low)"));
        for (const alert of report.criticalAlerts) {
          console.log(
            `  • ${alert.productTitle} (${alert.variantTitle}) — ${alert.currentStock} units`
          );
          console.log(`    ${chalk.dim(alert.recommendation)}`);
        }
      }

      if (report.warnings.length > 0) {
        console.log("\n" + chalk.yellow.bold("WARNINGS (Low Stock)"));
        for (const alert of report.warnings) {
          console.log(
            `  • ${alert.productTitle} (${alert.variantTitle}) — ${alert.currentStock} units`
          );
        }
      }

      console.log("\n" + chalk.bold("AI Insights"));
      console.log(report.aiInsights);

      if (report.reorderRecommendations.length > 0) {
        console.log("\n" + chalk.bold("Reorder Recommendations"));
        for (const rec of report.reorderRecommendations) {
          console.log(`  • ${rec}`);
        }
      }
    } catch (err) {
      spinner.fail("Failed to analyze inventory");
      console.error(chalk.red(String(err)));
      process.exit(1);
    }
  });

program
  .command("orders")
  .description("Analyze order history and get revenue insights")
  .option("-l, --limit <number>", "Number of orders to analyze", "250")
  .action(async (opts) => {
    const spinner = ora("Fetching order data...").start();
    try {
      const toolkit = getToolkit();
      const report = await toolkit.orders.generateReport(parseInt(opts.limit));
      spinner.succeed("Order analysis complete");

      console.log("\n" + chalk.bold("=== Order Analytics ==="));
      console.log(`Period: ${report.period}`);
      console.log(`Total orders: ${report.totalOrders}`);
      console.log(`Total revenue: $${report.totalRevenue.toFixed(2)}`);
      console.log(
        `Average order value: $${report.averageOrderValue.toFixed(2)}`
      );
      console.log(`Fulfillment rate: ${report.fulfillmentRate.toFixed(1)}%`);

      if (report.topProducts.length > 0) {
        console.log("\n" + chalk.bold("Top Products"));
        for (const p of report.topProducts.slice(0, 5)) {
          console.log(
            `  • ${p.title} — ${p.quantity} units / $${p.revenue.toFixed(2)}`
          );
        }
      }

      console.log("\n" + chalk.bold("AI Trends"));
      console.log(report.trends);

      if (report.recommendations.length > 0) {
        console.log("\n" + chalk.bold("Recommendations"));
        for (const rec of report.recommendations) {
          console.log(`  • ${rec}`);
        }
      }
    } catch (err) {
      spinner.fail("Failed to analyze orders");
      console.error(chalk.red(String(err)));
      process.exit(1);
    }
  });

program
  .command("customers")
  .description("Get AI-powered customer segmentation and retention insights")
  .option("-l, --limit <number>", "Number of customers to analyze", "100")
  .action(async (opts) => {
    const spinner = ora("Fetching customer data...").start();
    try {
      const toolkit = getToolkit();
      const report = await toolkit.customers.generateReport(
        parseInt(opts.limit)
      );
      spinner.succeed("Customer analysis complete");

      console.log("\n" + chalk.bold("=== Customer Insights ==="));
      console.log(`Total customers analyzed: ${report.totalCustomers}`);

      if (report.topCustomers.length > 0) {
        console.log("\n" + chalk.bold("Top Customers"));
        for (const c of report.topCustomers.slice(0, 5)) {
          console.log(
            `  • ${c.name || c.email} — $${parseFloat(c.totalSpent).toFixed(2)} / ${c.ordersCount} orders`
          );
        }
      }

      if (report.segments.length > 0) {
        console.log("\n" + chalk.bold("Customer Segments"));
        for (const seg of report.segments) {
          console.log(`\n  ${chalk.cyan(seg.name)} (${seg.description})`);
          for (const action of seg.recommendedActions) {
            console.log(`    → ${action}`);
          }
        }
      }

      console.log("\n" + chalk.bold("Retention Insights"));
      console.log(report.retentionInsights);

      if (report.growthOpportunities.length > 0) {
        console.log("\n" + chalk.bold("Growth Opportunities"));
        for (const opp of report.growthOpportunities) {
          console.log(`  • ${opp}`);
        }
      }
    } catch (err) {
      spinner.fail("Failed to analyze customers");
      console.error(chalk.red(String(err)));
      process.exit(1);
    }
  });

program
  .command("optimize-product <productId>")
  .description("AI-optimize a single product description and tags")
  .option("--apply", "Apply optimizations to the store", false)
  .action(async (productId, opts) => {
    const spinner = ora(`Optimizing product ${productId}...`).start();
    try {
      const toolkit = getToolkit();
      const result = await toolkit.products.optimizeProduct(productId);
      spinner.succeed("Product optimization complete");

      console.log("\n" + chalk.bold(`=== ${result.title} ===`));
      console.log(chalk.bold("SEO Title:"), result.seoTitle);
      console.log(chalk.bold("SEO Description:"), result.seoDescription);
      console.log(chalk.bold("Suggested Tags:"), result.suggestedTags.join(", "));
      console.log("\n" + chalk.bold("Optimized Description:"));
      console.log(result.optimizedDescription);

      if (opts.apply) {
        const applySpinner = ora("Applying to Shopify...").start();
        await toolkit.products.applyOptimization(result);
        applySpinner.succeed("Product updated in Shopify");
      } else {
        console.log(
          chalk.dim("\nRun with --apply to save changes to your store")
        );
      }
    } catch (err) {
      spinner.fail("Failed to optimize product");
      console.error(chalk.red(String(err)));
      process.exit(1);
    }
  });

program
  .command("discounts")
  .description("Get AI-recommended discount campaigns for your store")
  .action(async () => {
    const spinner = ora("Generating discount recommendations...").start();
    try {
      const toolkit = getToolkit();
      const recommendations = await toolkit.discounts.getRecommendations();
      spinner.succeed("Discount recommendations ready");

      console.log("\n" + chalk.bold("=== Discount Campaign Recommendations ==="));
      for (const rec of recommendations) {
        console.log(`\n${chalk.green.bold(rec.name)}`);
        console.log(`  Code: ${chalk.cyan(rec.code)}`);
        console.log(`  Discount: ${rec.discountPercent}% off`);
        console.log(`  Target: ${rec.targetSegment}`);
        console.log(`  Duration: ${rec.suggestedDuration}`);
        console.log(`  Rationale: ${rec.rationale}`);
        console.log(`  Expected Impact: ${rec.expectedImpact}`);
      }
    } catch (err) {
      spinner.fail("Failed to generate recommendations");
      console.error(chalk.red(String(err)));
      process.exit(1);
    }
  });

program.parse();
