/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockGateway } from '../stock/stock.gateway';

@Injectable()
export class StockService {
  private stockPrices: Record<string, number> = {
    AAPL: 120,
    MSFT: 210,
    GOOGL: 1500,
    AMZN: 3100,
    TSLA: 600,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly stockGateway: StockGateway,
  ) {
    this.initializeStockPrices();
    this.startPriceSimulation();
    this.startPortfolioUpdate();
  }

  // 🟢 Load initial prices from database
  private async initializeStockPrices() {
    const trades = await this.prisma.trade.findMany({
      distinct: ['stockSymbol'],
      select: { stockSymbol: true, price: true },
    });

    trades.forEach((trade) => {
      this.stockPrices[trade.stockSymbol] = trade.price;
    });
  }

  // 🟢 Improved Price Simulation with Geometric Brownian Motion (GBM)
  private startPriceSimulation() {
    console.log('Starting price simulation...');

    setInterval(() => {
      for (const symbol in this.stockPrices) {
        const S = this.stockPrices[symbol];
        const drift = 0.0005; // Market average drift (0.05%)
        const volatility = 0.02; // 2% Volatility per tick
        const randomShock = (Math.random() * 2 - 1) * volatility; // Generates -0.02 to +0.02

        // Geometric Brownian Motion formula
        const newPrice = S * Math.exp(drift + randomShock);

        this.stockPrices[symbol] = parseFloat(newPrice.toFixed(2));

        // Emit new stock prices in real-time
        this.stockGateway.sendStockPriceUpdate(
          symbol,
          this.stockPrices[symbol],
        );
      }
    }, 1000); // Update every 1 second
  }

  // 🟢 Portfolio Update with Real-Time Valuation
  private startPortfolioUpdate() {
    console.log('Starting portfolio update...');

    setInterval(async () => {
      const portfolios = await this.prisma.portfolio.findMany();

      for (const portfolio of portfolios) {
        const portfolioData = await this.calculatePortfolioWorth(portfolio.id);
        this.stockGateway.sendPortfolioUpdate(portfolio.id, portfolioData);
      }
    }, 2000); // Update every 2 seconds
  }

  // 🟢 Portfolio Calculation (Realistic Approach)
  async calculatePortfolioWorth(portfolioId: number) {
    const trades = await this.prisma.trade.findMany({
      where: { portfolioId },
    });

    let totalInvestment = 0;
    let totalProfit = 0;
    let portfolioWorth = 0;

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
