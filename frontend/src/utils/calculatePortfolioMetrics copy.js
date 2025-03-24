export const calculatePortfolioMetrics = (portfolio) => {
  if (!portfolio || !Array.isArray(portfolio.trades)) {
    console.warn("Portfolio or trades data is invalid.");
    return [];
  }

  console.log({ portfolio });

  const stockMetrics = {};

  portfolio.trades.forEach((trade) => {
    // Check if essential trade data exists
    const { stockSymbol, quantity, price, tradeType } = trade;

    if (!stockSymbol || quantity == null || price == null || !tradeType) {
      console.warn(
        `Missing or invalid data in trade: ${JSON.stringify(trade)}`
      );
      return; // Skip this trade if any essential field is missing
    }

    // Ensure quantity is a positive number
    if (quantity <= 0) {
      console.warn(`Invalid quantity in trade: ${JSON.stringify(trade)}`);
      return;
    }

    // Ensure price is a positive number
    if (price <= 0) {
      console.warn(`Invalid price in trade: ${JSON.stringify(trade)}`);
      return;
    }

    // Initialize stockMetrics for the stockSymbol if not already done
    if (!stockMetrics[stockSymbol]) {
      stockMetrics[stockSymbol] = {
        stockSymbol,
        totalInvestment: 0,
        totalProfit: 0,
        totalQuantity: 0,
        totalSharesBought: 0, // Track total shares bought to calculate average cost correctly
      };
    }

    const stock = stockMetrics[stockSymbol];

    if (tradeType === "BUY") {
      stock.totalInvestment += price * quantity; // Increase investment
      stock.totalQuantity += quantity; // Increase the quantity of shares held
      stock.totalSharesBought += quantity; // Track total shares bought
    } else if (tradeType === "SELL") {
      if (stock.totalQuantity >= quantity) {
        const averageCost = stock.totalInvestment / stock.totalQuantity; // Calculate average cost per share

        // Profit calculation: (Sell Price - Average Buy Price) * Quantity Sold
        stock.totalProfit += (price - averageCost) * quantity;

        // Adjust the investment based on the average cost of the shares sold
        stock.totalInvestment -= averageCost * quantity;

        stock.totalQuantity -= quantity; // Decrease the total quantity after selling
      } else {
        console.warn(
          `Attempted to sell more shares (${quantity}) than owned (${stock.totalQuantity}) for ${stockSymbol}.`
        );
      }
    } else {
      console.warn(
        `Unknown trade type "${tradeType}" in trade: ${JSON.stringify(trade)}`
      );
    }
  });

  return Object.values(stockMetrics);
};
