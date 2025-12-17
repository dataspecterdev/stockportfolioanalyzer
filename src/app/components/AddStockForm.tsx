import { useState } from "react";
import { Stock } from "../types/portfolio";

interface AddStockFormProps {
  onAddStock: (stock: Omit<Stock, "id">) => void;
}

export function AddStockForm({ onAddStock }: AddStockFormProps) {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol || !shares || !purchasePrice || !purchaseDate) {
      return;
    }

    onAddStock({
      symbol: symbol.toUpperCase(),
      shares: parseFloat(shares),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate,
    });

    // Reset form
    setSymbol("");
    setShares("");
    setPurchasePrice("");
    setPurchaseDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="mb-4">Add Stock to Portfolio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="symbol" className="block mb-2">
            Stock Symbol
          </label>
          <input
            id="symbol"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g., AAPL, GOOGL"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="shares" className="block mb-2">
            Number of Shares
          </label>
          <input
            id="shares"
            type="number"
            step="0.01"
            min="0"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            placeholder="e.g., 10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="purchasePrice" className="block mb-2">
            Purchase Price ($)
          </label>
          <input
            id="purchasePrice"
            type="number"
            step="0.01"
            min="0"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            placeholder="e.g., 150.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="purchaseDate" className="block mb-2">
            Purchase Date
          </label>
          <input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Stock
      </button>
    </form>
  );
}
