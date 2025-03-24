import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockGateway } from '../stock/stock.gateway';

@Injectable()
export class StockService {
  getAllPortfolios() {
    throw new Error('Method not implemented.');
  }
  private stockPrices: Record<string, number> = {
    AAPL: 120,
    MSFT: 210,
    GOOGL: 1500,
    AMZN: 3100,
    TSLA: 600,
  };
  constructor(
    private readonly prisma: PrismaService,
    private readonly StockGateway: StockGateway,
  ) {
    this.initializeStockPrices();
    this.startPriceSimulation();
    // this.startPortfolioUpdate();
  }

  private async initializeStockPrices() {
    const trades = await this.prisma.trade.findMany({
      distinct: ['stockSymbol'],
      select: { stockSymbol: true, price: true },
    });
    trades.forEach((trade) => {
      this.stockPrices[trade.stockSymbol] = trade.price;
    });
  }

  private startPriceSimulation() {
    console.log('Starting price simulation...');
    setInterval(() => {
      for (const symbol in this.stockPrices) {
        const S = this.stockPrices[symbol];
        const drift = 0.0001;
        const volatility = 0.01;
        const randomShock = Math.random() * volatility;
        const changeFactor = Math.exp(drift + randomShock);
        this.stockPrices[symbol] = parseFloat((S * changeFactor).toFixed(2));
        this.StockGateway.sendStockPriceUpdate(
          symbol,
          this.stockPrices[symbol],
        );
      }
    }, 1000);
  }

  private startPortfolioUpdate() {
    console.log('Starting portfolio update...');
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setInterval(async () => {
      const portfolios = await this.prisma.portfolio.findMany();
      for (const portfolio of portfolios) {
        const portfolioData = await this.calculatePortfolioWorth(portfolio.id);
        this.StockGateway.sendPortfolioUpdate(portfolio.id, portfolioData);
      }
    }, 2000); // Update every 2 seconds
  }

  async calculatePortfolioWorth(portfolioId: number) {
    const trades = await this.prisma.trade.findMany({
      where: { portfolioId },
    });

    let totalInvestment = 0;
    let totalProfit = 0;
    const stockHoldings: Record<
      string,
      { quantity: number; avgPrice: number }
    > = {};

    for (const trade of trades) {
      const latestPrice = this.stockPrices[trade.stockSymbol] || trade.price;
      if (!stockHoldings[trade.stockSymbol]) {
        stockHoldings[trade.stockSymbol] = { quantity: 0, avgPrice: 0 };
      }

      if (trade.tradeType === 'BUY') {
        stockHoldings[trade.stockSymbol].quantity += trade.quantity;
        totalInvestment += trade.quantity * trade.price;
        stockHoldings[trade.stockSymbol].avgPrice =
          (stockHoldings[trade.stockSymbol].avgPrice *
            (stockHoldings[trade.stockSymbol].quantity - trade.quantity) +
            trade.price * trade.quantity) /
          stockHoldings[trade.stockSymbol].quantity;
      } else if (trade.tradeType === 'SELL') {
        stockHoldings[trade.stockSymbol].quantity -= trade.quantity;
        totalProfit += (latestPrice - trade.price) * trade.quantity;
      }
    }

    let portfolioWorth = 0;
    for (const symbol in stockHoldings) {
      portfolioWorth +=
        stockHoldings[symbol].quantity * (this.stockPrices[symbol] || 0);
    }

    return {
      portfolioId,
      portfolioWorth: parseFloat(portfolioWorth.toFixed(2)),
      totalInvestment: parseFloat(totalInvestment.toFixed(2)),
      totalProfit: parseFloat(totalProfit.toFixed(2)),
    };
  }
}
