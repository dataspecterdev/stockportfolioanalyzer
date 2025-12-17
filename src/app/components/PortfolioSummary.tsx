import { PortfolioMetrics } from "../types/portfolio";
import { MetricCard } from "./MetricsCard";

interface PortfolioSummaryProps {
  metrics: PortfolioMetrics;
}

export function PortfolioSummary({ metrics }: PortfolioSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl">Portfolio Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Value"
          value={formatCurrency(metrics.totalValue)}
          subtitle={`Cost Basis: ${formatCurrency(metrics.totalCost)}`}
        />
        
        <MetricCard
          title="Total Return"
          value={formatCurrency(metrics.totalReturn)}
          subtitle={formatPercentage(metrics.totalReturnPercentage)}
          trend={metrics.totalReturn >= 0 ? "up" : "down"}
          icon="trending"
        />
        
        <MetricCard
          title="Annualized Return"
          value={formatPercentage(metrics.annualizedReturn)}
          subtitle="Since inception"
          trend={metrics.annualizedReturn >= 0 ? "up" : "down"}
          icon="trending"
        />
        
        <MetricCard
          title="Volatility"
          value={`${metrics.volatility.toFixed(2)}%`}
          subtitle="Annualized risk"
          icon="activity"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Sharpe Ratio"
          value={metrics.sharpeRatio.toFixed(2)}
          subtitle="Risk-adjusted return (4.5% risk-free rate)"
          trend={metrics.sharpeRatio > 1 ? "up" : metrics.sharpeRatio > 0 ? "neutral" : "down"}
          icon="target"
        />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-4">Key Insights</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                {metrics.sharpeRatio > 1.5
                  ? "Excellent risk-adjusted returns"
                  : metrics.sharpeRatio > 1
                  ? "Good risk-adjusted returns"
                  : metrics.sharpeRatio > 0
                  ? "Positive risk-adjusted returns"
                  : "Returns below risk-free rate"}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                {metrics.volatility < 15
                  ? "Low volatility portfolio"
                  : metrics.volatility < 25
                  ? "Moderate volatility portfolio"
                  : "High volatility portfolio"}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                {metrics.annualizedReturn > 10
                  ? "Outperforming market averages"
                  : metrics.annualizedReturn > 5
                  ? "Meeting market expectations"
                  : "Underperforming market averages"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
