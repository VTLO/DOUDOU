import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, ShoppingCart, CheckCircle, DollarSign } from "lucide-react";
import StatCard from "../components/StatCard.tsx";
import PageHeader from "../components/PageHeader.tsx";
import { mockOrders } from "../lib/mock.ts";

export default function Orders() {
  return (
    <div className="p-8">
      <PageHeader title="Orders" description="Revenue analytics and order performance" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Orders" value={mockOrders.totalOrders} icon={ShoppingCart} />
        <StatCard
          label="Revenue"
          value={`$${mockOrders.totalRevenue.toLocaleString("en", { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
        />
        <StatCard
          label="Avg Order Value"
          value={`$${mockOrders.averageOrderValue.toFixed(2)}`}
          icon={TrendingUp}
          trend={{ value: "+$12 vs prior", positive: true }}
        />
        <StatCard
          label="Fulfillment Rate"
          value={`${mockOrders.fulfillmentRate.toFixed(1)}%`}
          icon={CheckCircle}
          iconColor={mockOrders.fulfillmentRate >= 95 ? "text-green-500" : "text-amber-500"}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Top products chart */}
        <div className="card p-5 col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Revenue by Product</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockOrders.topProducts} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="title" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={140} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#008060" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI insights */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-shopify-50 flex items-center justify-center">
                <span className="text-shopify-600 text-[10px] font-bold">AI</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Trends</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{mockOrders.trends}</p>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Recommendations</h3>
            <ul className="space-y-2.5">
              {mockOrders.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-shopify-500 shrink-0 mt-0.5">→</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Top products table */}
      <div className="card mt-4 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Top Products Detail</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Product</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Units Sold</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Revenue</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500">Avg Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockOrders.topProducts.map((p) => (
              <tr key={p.title} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-800">{p.title}</td>
                <td className="px-5 py-3.5 text-right text-gray-600">{p.quantity}</td>
                <td className="px-5 py-3.5 text-right font-medium text-gray-800">${p.revenue.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-right text-gray-500">${(p.revenue / p.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
