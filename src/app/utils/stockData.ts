import { StockData, HistoricalPrice } from "../types/portfolio";

// Simulated stock database with realistic data
const STOCK_DATABASE: Record<string, { name: string; basePrice: number; volatility: number }> = {
  AAPL: { name: "Apple Inc.", basePrice: 195.0, volatility: 0.25 },
  GOOGL: { name: "Alphabet Inc.", basePrice: 140.0, volatility: 0.28 },
  MSFT: { name: "Microsoft Corporation", basePrice: 378.0, volatility: 0.23 },
  AMZN: { name: "Amazon.com Inc.", basePrice: 155.0, volatility: 0.32 },
  TSLA: { name: "Tesla Inc.", basePrice: 248.0, volatility: 0.45 },
  NVDA: { name: "NVIDIA Corporation", basePrice: 495.0, volatility: 0.38 },
  META: { name: "Meta Platforms Inc.", basePrice: 355.0, volatility: 0.35 },
  NFLX: { name: "Netflix Inc.", basePrice: 485.0, volatility: 0.40 },
  JPM: { name: "JPMorgan Chase & Co.", basePrice: 165.0, volatility: 0.22 },
  V: { name: "Visa Inc.", basePrice: 275.0, volatility: 0.20 },
  WMT: { name: "Walmart Inc.", basePrice: 165.0, volatility: 0.18 },
  DIS: { name: "The Walt Disney Company", basePrice: 95.0, volatility: 0.30 },
  COST: { name: "Costco Wholesale Corporation", basePrice: 745.0, volatility: 0.21 },
  BA: { name: "The Boeing Company", basePrice: 172.0, volatility: 0.42 },
  XOM: { name: "Exxon Mobil Corporation", basePrice: 112.0, volatility: 0.27 },
};

// Generate realistic historical prices using geometric Brownian motion
function generateHistoricalPrices(
  basePrice: number,
  volatility: number,
  days: number
): HistoricalPrice[] {
  const prices: HistoricalPrice[] = [];
  let currentPrice = basePrice;
  const drift = 0.0003; // Small daily drift (positive trend)
  
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }
    
    prices.push({
      date: date.toISOString().split('T')[0],
      price: currentPrice,
    });
    
    // Generate next price using geometric Brownian motion
    const randomShock = (Math.random() - 0.5) * 2;
    const dailyReturn = drift + (volatility / Math.sqrt(252)) * randomShock;
    currentPrice = currentPrice * (1 + dailyReturn);
  }
  
  return prices;
}

export async function fetchStockData(symbol: string): Promise<StockData | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const stockInfo = STOCK_DATABASE[symbol.toUpperCase()];
  
  if (!stockInfo) {
    return null;
  }
  
  const historicalPrices = generateHistoricalPrices(
    stockInfo.basePrice,
    stockInfo.volatility,
    365 // Last year of data
  );
  
  const currentPrice = historicalPrices[historicalPrices.length - 1].price;
  
  return {
    symbol: symbol.toUpperCase(),
    currentPrice,
    historicalPrices,
    companyName: stockInfo.name,
  };
}

export function isValidSymbol(symbol: string): boolean {
  return symbol.toUpperCase() in STOCK_DATABASE;
}

export function getAvailableSymbols(): string[] {
  return Object.keys(STOCK_DATABASE);
}
