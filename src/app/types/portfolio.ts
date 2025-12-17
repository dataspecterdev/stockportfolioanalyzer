export interface Stock {
  id: string;
  symbol: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
}

export interface StockData {
  symbol: string;
  currentPrice: number;
  historicalPrices: HistoricalPrice[];
  companyName: string;
}

export interface HistoricalPrice {
  date: string;
  price: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercentage: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

export interface StockPosition {
  stock: Stock;
  currentPrice: number;
  currentValue: number;
  costBasis: number;
  gain: number;
  gainPercentage: number;
  weight: number;
}
