import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import PageHeader from "../components/PageHeader.tsx";
import { mockInventory } from "../lib/mock.ts";

function SeverityBadge({ severity, stock }: { severity: string; stock: number }) {
  if (severity === "critical")
    return <span className="badge-critical"><AlertTriangle className="w-3 h-3" />{stock === 0 ? "Out of stock" : `${stock} left`}</span>;
  if (severity === "warning")
    return <span className="badge-warning"><AlertTriangle className="w-3 h-3" />{stock} left</span>;
  return <span className="badge-ok"><CheckCircle className="w-3 h-3" />In stock</span>;
}

export default function Inventory() {
  const all = [...mockInventory.criticalAlerts, ...mockInventory.warnings];

  return (
    <div className="p-8">
      <PageHeader
        title="Inventory"
        description="Stock levels with AI-powered reorder recommendations"
        action={
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{mockInventory.totalProducts}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Products</p>
        </div>
        <div className="card p-4 text-center border-red-200">
          <p className="text-2xl font-bold text-red-600">{mockInventory.criticalAlerts.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Critical Alerts</p>
        </div>
        <div className="card p-4 text-center border-amber-200">
          <p className="text-2xl font-bold text-amber-500">{mockInventory.warnings.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Warnings</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Alert table */}
        <div className="card col-span-2 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Active Alerts</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Product</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {all.map((a) => (
                <tr key={a.variantId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{a.productTitle}</p>
                    <p className="text-xs text-gray-400">{a.variantTitle}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{a.sku}</td>
                  <td className="px-4 py-3.5">
                    <SeverityBadge severity={a.severity} stock={a.currentStock} />
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{a.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Panel */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-shopify-50 flex items-center justify-center">
                <span className="text-shopify-600 text-[10px] font-bold">AI</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Claude's Assessment</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{mockInventory.aiInsights}</p>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Reorder Recommendations</h3>
            <ul className="space-y-2.5">
              {mockInventory.reorderRecommendations.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-shopify-500 shrink-0 mt-0.5">→</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
