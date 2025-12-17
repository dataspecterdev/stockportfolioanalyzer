import { Stock, StockData, PortfolioMetrics, StockPosition, HistoricalPrice } from "../types/portfolio";

export function calculateStockPosition(
  stock: Stock,
  stockData: StockData,
  totalPortfolioValue: number
): StockPosition {
  const currentValue = stock.shares * stockData.currentPrice;
  const costBasis = stock.shares * stock.purchasePrice;
  const gain = currentValue - costBasis;
  const gainPercentage = (gain / costBasis) * 100;
  const weight = (currentValue / totalPortfolioValue) * 100;

  return {
    stock,
    currentPrice: stockData.currentPrice,
    currentValue,
    costBasis,
    gain,
    gainPercentage,
    weight,
  };
}

export function calculatePortfolioMetrics(
  stocks: Stock[],
  stockDataMap: Map<string, StockData>
): PortfolioMetrics {
  let totalValue = 0;
  let totalCost = 0;

  const positions: StockPosition[] = [];

  // Calculate basic metrics
  stocks.forEach((stock) => {
    const stockData = stockDataMap.get(stock.symbol);
    if (!stockData) return;

    const currentValue = stock.shares * stockData.currentPrice;
    const costBasis = stock.shares * stock.purchasePrice;

    totalValue += currentValue;
    totalCost += costBasis;

    positions.push({
      stock,
      currentPrice: stockData.currentPrice,
      currentValue,
      costBasis,
      gain: currentValue - costBasis,
      gainPercentage: ((currentValue - costBasis) / costBasis) * 100,
      weight: 0, // Will be calculated after we have total value
    });
  });

  // Update weights
  positions.forEach((pos) => {
    pos.weight = (pos.currentValue / totalValue) * 100;
  });

  const totalReturn = totalValue - totalCost;
  const totalReturnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

  // Calculate annualized return
  const oldestPurchaseDate = stocks.reduce((oldest, stock) => {
    const date = new Date(stock.purchaseDate);
    return date < oldest ? date : oldest;
  }, new Date());

  const daysSincePurchase = Math.max(
    1,
    (new Date().getTime() - oldestPurchaseDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const yearsSincePurchase = daysSincePurchase / 365;

  const annualizedReturn =
    totalCost > 0 && yearsSincePurchase > 0
      ? (Math.pow(totalValue / totalCost, 1 / yearsSincePurchase) - 1) * 100
      : 0;

  // Calculate portfolio volatility
  const volatility = calculatePortfolioVolatility(stocks, stockDataMap, positions);

  // Calculate Sharpe ratio (assuming risk-free rate of 4.5%)
  const riskFreeRate = 4.5;
  const sharpeRatio = volatility > 0 ? (annualizedReturn - riskFreeRate) / volatility : 0;

  return {
    totalValue,
    totalCost,
    totalReturn,
    totalReturnPercentage,
    annualizedReturn,
    volatility,
    sharpeRatio,
  };
}

function calculatePortfolioVolatility(
  stocks: Stock[],
  stockDataMap: Map<string, StockData>,
  positions: StockPosition[]
): number {
  if (stocks.length === 0) return 0;

  // Calculate daily returns for each stock
  const stockReturns: Map<string, number[]> = new Map();

  stocks.forEach((stock) => {
    const stockData = stockDataMap.get(stock.symbol);
    if (!stockData) return;

    const returns = calculateDailyReturns(stockData.historicalPrices);
    stockReturns.set(stock.symbol, returns);
  });

  // Calculate weighted portfolio returns
  const portfolioReturns: number[] = [];
  const maxLength = Math.max(
    ...Array.from(stockReturns.values()).map((returns) => returns.length)
  );

  for (let i = 0; i < maxLength; i++) {
    let dayReturn = 0;
    positions.forEach((pos) => {
      const returns = stockReturns.get(pos.stock.symbol);
      if (returns && i < returns.length) {
        dayReturn += (pos.weight / 100) * returns[i];
      }
    });
    portfolioReturns.push(dayReturn);
  }

  // Calculate standard deviation of returns
  const mean = portfolioReturns.reduce((sum, r) => sum + r, 0) / portfolioReturns.length;
  const variance =
    portfolioReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
    portfolioReturns.length;
  const dailyVolatility = Math.sqrt(variance);

  // Annualize volatility
  return dailyVolatility * Math.sqrt(252) * 100;
}

function calculateDailyReturns(prices: HistoricalPrice[]): number[] {
  const returns: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    const dailyReturn = (prices[i].price - prices[i - 1].price) / prices[i - 1].price;
    returns.push(dailyReturn);
  }
  
  return returns;
}

export function calculatePortfolioHistoricalValue(
  stocks: Stock[],
  stockDataMap: Map<string, StockData>
): HistoricalPrice[] {
  if (stocks.length === 0) return [];

  // Get all unique dates
  const allDates = new Set<string>();
  stocks.forEach((stock) => {
    const stockData = stockDataMap.get(stock.symbol);
    if (stockData) {
      stockData.historicalPrices.forEach((price) => {
        allDates.add(price.date);
      });
    }
  });

  const sortedDates = Array.from(allDates).sort();
  const portfolioValues: HistoricalPrice[] = [];

  sortedDates.forEach((date) => {
    let totalValue = 0;

    stocks.forEach((stock) => {
      const stockData = stockDataMap.get(stock.symbol);
      if (!stockData) return;

      // Find the price for this date or the closest previous date
      const price = stockData.historicalPrices.find((p) => p.date === date);
      if (price && new Date(date) >= new Date(stock.purchaseDate)) {
        totalValue += stock.shares * price.price;
      }
    });

    if (totalValue > 0) {
      portfolioValues.push({
        date,
        price: totalValue,
      });
    }
  });

  return portfolioValues;
}
