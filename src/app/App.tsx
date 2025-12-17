import { useState, useEffect } from "react";
import { Stock, StockData, PortfolioMetrics, StockPosition } from "./types/portfolio";
import { fetchStockData, getAvailableSymbols } from "./utils/stockData";
import { calculatePortfolioMetrics, calculateStockPosition, calculatePortfolioHistoricalValue } from "./utils/calculations";
import { AddStockForm } from "./components/AddStockForm";
import { StockList } from "./components/StockList";
import { PortfolioSummary } from "./components/PortfolioSummary";
import { PortfolioChart } from "./components/PortfolioChart";
import { AllocationChart } from "./components/AllocationChart";
import { PerformanceChart } from "./components/PerformanceChart";
import { PositionsTable } from "./components/PositionsTable";
import { TrendingUp, Info } from "lucide-react";

export default function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stockDataMap, setStockDataMap] = useState<Map<string, StockData>>(new Map());
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  // Load stock data whenever stocks change
  useEffect(() => {
    const loadStockData = async () => {
      const newDataMap = new Map(stockDataMap);
      let hasNewData = false;

      for (const stock of stocks) {
        if (!newDataMap.has(stock.symbol)) {
          setLoading(true);
          const data = await fetchStockData(stock.symbol);
          if (data) {
            newDataMap.set(stock.symbol, data);
            hasNewData = true;
          }
        }
      }

      if (hasNewData) {
        setStockDataMap(newDataMap);
      }
      setLoading(false);
    };

    loadStockData();
  }, [stocks]);

  const handleAddStock = (newStock: Omit<Stock, "id">) => {
    const stock: Stock = {
      ...newStock,
      id: Date.now().toString(),
    };
    setStocks([...stocks, stock]);
  };

  const handleRemoveStock = (id: string) => {
    setStocks(stocks.filter((s) => s.id !== id));
  };

  // Calculate metrics and positions
  const metrics: PortfolioMetrics | null =
    stocks.length > 0 && stockDataMap.size > 0
      ? calculatePortfolioMetrics(stocks, stockDataMap)
      : null;

  const positions: StockPosition[] = stocks
    .map((stock) => {
      const stockData = stockDataMap.get(stock.symbol);
      if (!stockData || !metrics) return null;
      return calculateStockPosition(stock, stockData, metrics.totalValue);
    })
    .filter((p): p is StockPosition => p !== null);

  const portfolioHistory = stocks.length > 0 ? calculatePortfolioHistoricalValue(stocks, stockDataMap) : [];

  const availableSymbols = getAvailableSymbols();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl text-gray-900">Stock Portfolio Analyzer</h1>
              <p className="text-gray-600 mt-1">
                Track performance, analyze metrics, and optimize your investments
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        {showInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 mb-2">
                This demo uses simulated stock data for the following symbols:{" "}
                <strong>{availableSymbols.join(", ")}</strong>
              </p>
              <p className="text-sm text-blue-800">
                Add stocks to your portfolio to see real-time calculations of returns, volatility, Sharpe ratio, and interactive visualizations.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Close info"
            >
              ×
            </button>
          </div>
        )}

        {/* Add Stock Form */}
        <div className="mb-8">
          <AddStockForm onAddStock={handleAddStock} />
        </div>

        {/* Stock List */}
        <div className="mb-8">
          <StockList stocks={stocks} onRemoveStock={handleRemoveStock} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading stock data...</p>
          </div>
        )}

        {/* Portfolio Summary and Charts */}
        {metrics && positions.length > 0 && !loading && (
          <div className="space-y-8">
            {/* Summary Metrics */}
            <PortfolioSummary metrics={metrics} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PortfolioChart data={portfolioHistory} />
              <AllocationChart positions={positions} />
            </div>

            {/* Performance Chart */}
            <PerformanceChart positions={positions} />

            {/* Positions Table */}
            <PositionsTable positions={positions} />
          </div>
        )}

        {/* Empty State */}
        {stocks.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">Start Building Your Portfolio</h3>
            <p className="text-gray-600 mb-6">
              Add your first stock above to begin tracking performance and analyzing investment metrics.
            </p>
            <div className="max-w-md mx-auto text-left bg-gray-50 rounded-lg p-4">
              <p className="text-sm mb-2">
                <strong>Example stocks to try:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• AAPL - Apple Inc.</li>
                <li>• GOOGL - Alphabet Inc.</li>
                <li>• MSFT - Microsoft Corporation</li>
                <li>• TSLA - Tesla Inc.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
