import { Stock } from "../types/portfolio";
import { Trash2 } from "lucide-react";

interface StockListProps {
  stocks: Stock[];
  onRemoveStock: (id: string) => void;
}

export function StockList({ stocks, onRemoveStock }: StockListProps) {
  if (stocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <p>No stocks in portfolio. Add your first stock above to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="mb-4">Portfolio Holdings</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Symbol</th>
              <th className="text-right py-3 px-4">Shares</th>
              <th className="text-right py-3 px-4">Purchase Price</th>
              <th className="text-left py-3 px-4">Purchase Date</th>
              <th className="text-right py-3 px-4">Cost Basis</th>
              <th className="text-center py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{stock.symbol}</td>
                <td className="text-right py-3 px-4">{stock.shares}</td>
                <td className="text-right py-3 px-4">
                  ${stock.purchasePrice.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  {new Date(stock.purchaseDate).toLocaleDateString()}
                </td>
                <td className="text-right py-3 px-4">
                  ${(stock.shares * stock.purchasePrice).toFixed(2)}
                </td>
                <td className="text-center py-3 px-4">
                  <button
                    onClick={() => onRemoveStock(stock.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    aria-label="Remove stock"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
