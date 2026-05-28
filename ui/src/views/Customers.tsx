import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import PageHeader from "../components/PageHeader.tsx";
import { mockCustomers } from "../lib/mock.ts";

const SEGMENT_COLORS = ["#008060", "#4ab680", "#80d1a6", "#d9f2e3"];

export default function Customers() {
  const pieData = mockCustomers.segments.map((s) => ({
    name: s.name,
    value: s.customerCount,
  }));

  return (
    <div className="p-8">
      <PageHeader
        title="Customers"
        description="AI-powered segmentation and retention insights"
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Pie chart */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Segment Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number, name: string) => [v, name]} />
              <Legend iconSize={10} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Segments */}
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {mockCustomers.segments.map((seg, i) => (
            <div key={seg.name} className="card p-4">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: SEGMENT_COLORS[i] }} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{seg.name}</p>
                  <p className="text-xs text-gray-500">{seg.customerCount} customers · AOV ${seg.averageOrderValue}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">{seg.criteria}</p>
              <ul className="space-y-1">
                {seg.recommendedActions.slice(0, 2).map((a, j) => (
                  <li key={j} className="text-xs text-gray-600 flex gap-1.5">
                    <span className="text-shopify-500">→</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Top customers */}
        <div className="card col-span-2 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Top Customers</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Customer</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Orders</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockCustomers.topCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{c.name || "—"}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-600">{c.ordersCount}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-gray-800">
                    ${parseFloat(c.totalSpent).toLocaleString("en", { minimumFractionDigits: 2 })}
                  </td>
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
              <h3 className="text-sm font-semibold text-gray-700">Retention Insights</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{mockCustomers.retentionInsights}</p>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Growth Opportunities</h3>
            <ul className="space-y-2.5">
              {mockCustomers.growthOpportunities.map((o, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-shopify-500 shrink-0 mt-0.5">→</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
