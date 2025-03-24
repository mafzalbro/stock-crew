const yahooFinance = require("yahoo-finance2").default;

export async function getStockPrice(stockSymbol) {
  try {
    yahooFinance.suppressNotices(["yahooSurvey"]);
    const quote = await yahooFinance.quote(stockSymbol);
    return quote.regularMarketPrice;
  } catch (error) {
    console.error(`Error fetching data for ${stockSymbol}:`, error);
    return null;
  }
}
