const { getStockPrice } = require("./getStockPrice");

export async function calculatePortfolioMetrics(portfolio) {
  if (!portfolio || !Array.isArray(portfolio.trades)) {
    console.warn("Portfolio or trades data is invalid.");
    return [];
  }

  const stockMetrics = {};

  for (const trade of portfolio.trades) {
    const { stockSymbol, quantity, price, tradeType } = trade;

    if (!stockSymbol || quantity == null || price == null || !tradeType) {
      console.warn(
        `Missing or invalid data in trade: ${JSON.stringify(trade)}`
      );
      continue;
    }

    if (quantity <= 0 || price <= 0) {
      console.warn(
        `Invalid quantity or price in trade: ${JSON.stringify(trade)}`
      );
      continue;
    }

    if (!stockMetrics[stockSymbol]) {
      stockMetrics[stockSymbol] = {
        stockSymbol,
        totalInvestment: 0,
        totalProfit: 0,
        totalQuantity: 0,
      };
    }

    const stock = stockMetrics[stockSymbol];

    if (tradeType === "BUY") {
      stock.totalInvestment += price * quantity;
      stock.totalQuantity += quantity;
    } else if (tradeType === "SELL") {
      if (stock.totalQuantity >= quantity) {
        const averageCost = stock.totalInvestment / stock.totalQuantity;
        stock.totalProfit += (price - averageCost) * quantity;
        stock.totalInvestment -= averageCost * quantity;
        stock.totalQuantity -= quantity;
      } else {
        console.warn(
          `Attempted to sell more shares than owned for ${stockSymbol}.`
        );
      }
    } else {
      console.warn(
        `Unknown trade type "${tradeType}" in trade: ${JSON.stringify(trade)}`
      );
    }
  }

  for (const symbol in stockMetrics) {
    const stock = stockMetrics[symbol];
    const currentPrice = await getStockPrice(symbol);
    if (currentPrice !== null) {
      const currentInvestmentValue = stock.totalQuantity * currentPrice;
      stock.totalProfit += currentInvestmentValue - stock.totalInvestment;
    }
  }

  return Object.values(stockMetrics); 
}
