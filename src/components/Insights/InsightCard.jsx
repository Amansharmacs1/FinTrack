import React from 'react';
import { Lightbulb } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const InsightCard = ({ insight, settings }) => {
  if (!insight) return null;

  return (
    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mt-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Lightbulb className="w-24 h-24 text-amber-500" />
      </div>
      <div className="flex items-start gap-3 relative z-10">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-900 mb-1">💡 Financial Insight</h3>
          <p className="text-amber-800 text-sm leading-relaxed mb-3">
            You received {insight.eventCount} income payments recently, averaging {formatCurrency(insight.avgIncomeEvent, settings.currency)} per event. 
            Your income is irregular, so maintaining a larger cash buffer is recommended.
          </p>
          {insight.avgMonthlyExpense > 0 && (
            <div className="bg-white/60 rounded-xl p-3 inline-block">
              <span className="text-amber-900 text-sm font-medium">
                Based on your average expenses, your current balance covers approx. <strong>{insight.runwayMonths.toFixed(1)} months</strong> of runway.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
