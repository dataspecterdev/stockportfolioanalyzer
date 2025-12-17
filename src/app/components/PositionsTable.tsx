import { StockPosition } from "../types/portfolio";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PositionsTableProps {
  positions: StockPosition[];
}

export function PositionsTable({ positions }: PositionsTableProps) {
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="mb-4">Positions Detail</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Symbol</th>
              <th className="text-right py-3 px-4">Shares</th>
              <th className="text-right py-3 px-4">Avg Cost</th>
              <th className="text-right py-3 px-4">Current Price</th>
              <th className="text-right py-3 px-4">Market Value</th>
              <th className="text-right py-3 px-4">Gain/Loss</th>
              <th className="text-right py-3 px-4">Return</th>
              <th className="text-right py-3 px-4">Weight</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{position.stock.symbol}</td>
                <td className="text-right py-3 px-4">{position.stock.shares}</td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(position.stock.purchasePrice)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(position.currentPrice)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(position.currentValue)}
                </td>
                <td className={`text-right py-3 px-4 ${position.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <div className="flex items-center justify-end gap-1">
                    {position.gain >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {formatCurrency(Math.abs(position.gain))}
                  </div>
                </td>
                <td className={`text-right py-3 px-4 ${position.gainPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(position.gainPercentage)}
                </td>
                <td className="text-right py-3 px-4">
                  {position.weight.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
