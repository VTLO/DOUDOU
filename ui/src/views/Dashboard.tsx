import { ShoppingCart, Users, Package, TrendingUp, AlertTriangle } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import StatCard from "../components/StatCard.tsx";
import { mockOrders, mockInventory, mockCustomers, revenueChartData } from "../lib/mock.ts";

export default function Dashboard() {
  const critical = mockInventory.criticalAlerts.length;
  const warnings = mockInventory.warnings.length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your store at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={`$${mockOrders.totalRevenue.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          sub="Last 250 orders"
          icon={TrendingUp}
          trend={{ value: "18% vs prior period", positive: true }}
        />
        <StatCard
          label="Orders"
          value={mockOrders.totalOrders}
          sub={`AOV $${mockOrders.averageOrderValue.toFixed(0)}`}
          icon={ShoppingCart}
          trend={{ value: `${mockOrders.fulfillmentRate.toFixed(1)}% fulfilled`, positive: true }}
        />
        <StatCard
          label="Customers"
          value={mockCustomers.totalCustomers.toLocaleString()}
          sub="Total customers"
          icon={Users}
          trend={{ value: "57% one-time buyers", positive: false }}
        />
        <StatCard
          label="Stock Alerts"
          value={critical + warnings}
          sub={`${critical} critical · ${warnings} warnings`}
          icon={critical > 0 ? AlertTriangle : Package}
          iconColor={critical > 0 ? "text-red-500" : "text-amber-500"}
          trend={critical > 0 ? { value: `${critical} out of stock`, positive: false } : undefined}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="card p-5 col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Revenue — May 2026</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008060" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#008060" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#008060" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Top Products</h2>
          <div className="space-y-3">
            {mockOrders.topProducts.map((p, i) => (
              <div key={p.title}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 truncate mr-2">{p.title}</span>
                  <span className="text-gray-500 shrink-0">${p.revenue.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-shopify-500 rounded-full"
                    style={{ width: `${(p.revenue / mockOrders.topProducts[0].revenue) * 100}%` }}
                  />
                </div>
                {i < mockOrders.topProducts.length - 1 && <div className="mt-3" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-4 card p-5 border-l-4 border-l-shopify-500">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-shopify-50 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-shopify-600 text-xs font-bold">AI</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">Claude's Top Insight</p>
            <p className="text-sm text-gray-600">{mockOrders.trends}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
