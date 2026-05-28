import { Tag, Clock, Users, Zap } from "lucide-react";
import PageHeader from "../components/PageHeader.tsx";
import { mockDiscounts } from "../lib/mock.ts";

function DiscountCard({ rec }: { rec: (typeof mockDiscounts)[0] }) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{rec.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{rec.targetSegment}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-shopify-600">{rec.discountPercent}%</span>
          <p className="text-xs text-gray-400">off</p>
        </div>
      </div>

      {/* Code */}
      <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between mb-3">
        <span className="font-mono text-sm font-semibold text-gray-700 tracking-wider">{rec.code}</span>
        <button
          className="text-xs text-shopify-600 hover:text-shopify-700 font-medium"
          onClick={() => navigator.clipboard.writeText(rec.code)}
        >
          Copy
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex gap-2">
          <Zap className="w-3.5 h-3.5 text-shopify-500 shrink-0 mt-0.5" />
          <p>{rec.rationale}</p>
        </div>
        <div className="flex gap-2">
          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-gray-500">{rec.suggestedDuration}</p>
        </div>
        <div className="flex gap-2">
          <Users className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-gray-500">{rec.targetSegment}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs font-medium text-shopify-700 bg-shopify-50 rounded px-2 py-1.5">
          {rec.expectedImpact}
        </p>
      </div>
    </div>
  );
}

export default function Discounts() {
  return (
    <div className="p-8">
      <PageHeader
        title="Discount Campaigns"
        description="AI-recommended promotions tailored to your store segments"
        action={
          <button className="btn-primary flex items-center gap-2">
            <Tag className="w-4 h-4" /> Generate New
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4">
        {mockDiscounts.map((rec) => (
          <DiscountCard key={rec.code} rec={rec} />
        ))}
      </div>

      <div className="mt-6 card p-5 border-l-4 border-l-shopify-500">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-shopify-50 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-shopify-600 text-xs font-bold">AI</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">Strategy Note</p>
            <p className="text-sm text-gray-600">
              Prioritise <strong>VIP20</strong> and <strong>MISSYOU20</strong> this week — they target high-value segments with the strongest expected ROI. Run <strong>BUNDLE10</strong> store-wide to lift average order value before any major campaign.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
