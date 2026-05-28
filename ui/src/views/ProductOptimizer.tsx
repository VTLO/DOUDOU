import { useState } from "react";
import { Sparkles, ChevronRight, Check, Loader2 } from "lucide-react";
import PageHeader from "../components/PageHeader.tsx";
import { mockProducts } from "../lib/mock.ts";
import type { OptimizeResult } from "../lib/api.ts";

const mockOptimized: Record<string, OptimizeResult> = {
  p1: {
    productId: "p1",
    title: "Classic Crew Tee",
    originalDescription: "<p>A comfortable everyday t-shirt.</p>",
    optimizedDescription: "<p>Meet your new everyday essential. The <strong>Classic Crew Tee</strong> is crafted from 100% ring-spun cotton for all-day softness that only gets better with every wash. A clean crew neck, relaxed fit, and timeless silhouette make it the piece you'll reach for again and again — from weekend coffee runs to casual Fridays.</p><ul><li>Pre-shrunk, so the fit stays true</li><li>Reinforced shoulder seams for lasting durability</li><li>Available in 8 colours</li></ul>",
    suggestedTags: ["t-shirt", "classic", "everyday", "cotton", "casual", "unisex", "crew-neck"],
    seoTitle: "Classic Crew Tee | Everyday Cotton T-Shirt",
    seoDescription: "Shop the Classic Crew Tee — 100% ring-spun cotton, pre-shrunk, available in 8 colours. The everyday essential you'll wear on repeat.",
  },
  p3: {
    productId: "p3",
    title: "Merino Wool Sweater",
    originalDescription: "<p>Premium merino wool sweater.</p>",
    optimizedDescription: "<p>Luxury warmth without the bulk. Our <strong>Merino Wool Sweater</strong> is knitted from fine 18-micron merino for a remarkably soft feel against bare skin — no itch, no compromise. Temperature-regulating merino keeps you comfortable from cool mornings to warm afternoons, making it the only sweater you'll need for three seasons.</p><ul><li>18-micron extra-fine merino wool</li><li>Naturally odour-resistant and moisture-wicking</li><li>Relaxed fit, ribbed cuffs and hem</li></ul>",
    suggestedTags: ["sweater", "merino", "wool", "knitwear", "premium", "warm", "sustainable"],
    seoTitle: "Merino Wool Sweater | Fine 18-Micron Knitwear",
    seoDescription: "Our Merino Wool Sweater — 18-micron extra-fine merino, naturally soft, odour-resistant, and temperature-regulating. Luxury warmth for three seasons.",
  },
};

type Status = "idle" | "loading" | "done" | "applying" | "applied";

export default function ProductOptimizer() {
  const [selectedId, setSelectedId] = useState<string>("p1");
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const selected = mockProducts.find((p) => p.id === selectedId);

  async function handleOptimize() {
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1400));
    setResult(mockOptimized[selectedId] ?? {
      productId: selectedId,
      title: selected?.title ?? "",
      originalDescription: selected?.body_html ?? "",
      optimizedDescription: `<p><strong>${selected?.title}</strong> — AI-optimized description would appear here when connected to your Shopify store and Anthropic API.</p>`,
      suggestedTags: ["optimized", "ai-generated"],
      seoTitle: `${selected?.title} | AI Optimized`,
      seoDescription: `Shop ${selected?.title} — optimized for search and conversion.`,
    });
    setStatus("done");
  }

  async function handleApply() {
    setStatus("applying");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("applied");
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Product AI Optimizer"
        description="Rewrite product descriptions, SEO titles, and tags with Claude"
      />

      <div className="grid grid-cols-3 gap-4">
        {/* Product selector */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Select Product</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {mockProducts.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => { setSelectedId(p.id); setResult(null); setStatus("idle"); }}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors text-sm ${
                    selectedId === p.id ? "bg-shopify-50 text-shopify-700" : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">${p.variants[0].price}</p>
                  </div>
                  {selectedId === p.id && <ChevronRight className="w-4 h-4 shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main panel */}
        <div className="col-span-2 space-y-4">
          {/* Original */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Current Description</h2>
            <div
              className="text-sm text-gray-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: selected?.body_html ?? "" }}
            />
            <button
              onClick={handleOptimize}
              disabled={status === "loading" || status === "applying"}
              className="btn-primary mt-4 flex items-center gap-2 disabled:opacity-50"
            >
              {status === "loading" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Optimizing…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Optimize with AI</>
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="card p-5 border-shopify-200">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-shopify-500" />
                <h2 className="text-sm font-semibold text-gray-700">AI Optimized</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                  <div
                    className="text-sm text-gray-700 prose prose-sm max-w-none bg-shopify-50 rounded-lg p-3"
                    dangerouslySetInnerHTML={{ __html: result.optimizedDescription }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">SEO Title</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2">{result.seoTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Meta Description</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2">{result.seoDescription}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Suggested Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.suggestedTags.map((t) => (
                      <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  disabled={status === "applied" || status === "applying"}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    status === "applied"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "btn-primary"
                  } disabled:opacity-60`}
                >
                  {status === "applying" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Applying…</>
                  ) : status === "applied" ? (
                    <><Check className="w-4 h-4" /> Applied to Shopify</>
                  ) : (
                    "Apply to Store"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
