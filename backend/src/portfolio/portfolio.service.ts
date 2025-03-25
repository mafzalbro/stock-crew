import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async createPortfolio(@Body() data: any) {
    return await this.prisma.portfolio.create({
      data,
    });
  }

  // async getAllPortfolios() {
  //   const portfolios = await this.prisma.portfolio.findMany({
  //     include: { trades: true },
  //   });

  //   const portfoliosWithMetrics = await Promise.all(
  //     portfolios.map(async (portfolio) => {
  //       const metrics = await this.getPortfolioSummary(portfolio.id);
  //       return { ...portfolio, ...metrics };
  //     })
  //   );

  //   return portfoliosWithMetrics;
  // }

  // async getPortfolioById(portfolioId: number) {
  //   const summary = await this.getPortfolioSummary(portfolioId);
  //   const portfolio = await this.prisma.portfolio.findUnique({
  //     where: { id: portfolioId },
  //     include: { trades: true },
  //   });
  //   return { ...portfolio, ...summary };
  // }

  async getAllPortfolios() {
    const portfolios = await this.prisma.portfolio.findMany();
    return portfolios.map((portfolio) => ({
      ...portfolio,
      value: this.generateDummySummary().totalCurrentValue,
      ...this.generateDummySummary(),
    }));
  }

  async getPortfolioById(portfolioId: number) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { trades: true },
    });
    return { ...portfolio, ...this.generateDummySummary() };
  }

  private generateDummySummary() {
    const totalInvestment = Math.random() * 10000;
    const totalCurrentValue = totalInvestment * (0.9 + Math.random() * 0.2);
    const profitOrLoss = totalCurrentValue - totalInvestment;
    const profitOrLossPercentage = (profitOrLoss / totalInvestment) * 100;

    return {
      totalInvestment,
      totalCurrentValue,
      profitOrLoss,
      profitOrLossPercentage,
    };
  }

  async getPortfolioSummary(portfolioId: number) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { trades: true },
    });

    if (!portfolio) throw new Error('Portfolio not found');

    let totalInvestment = 0;
    let totalCurrentValue = 0;

    for (const trade of portfolio.trades) {
      const latestPrice = this.getLatestStockPrice(trade.stockSymbol);

      if (trade.tradeType === 'BUY') {
        totalInvestment += trade.price * trade.quantity;
        totalCurrentValue += latestPrice * trade.quantity;
      } else if (trade.tradeType === 'SELL') {
        totalInvestment -= trade.price * trade.quantity;
        totalCurrentValue -= latestPrice * trade.quantity;
      }
    }

    const profitOrLoss = totalCurrentValue - totalInvestment;
    const profitOrLossPercentage = (profitOrLoss / totalInvestment) * 100 || 0;

    return {
      totalInvestment,
      totalCurrentValue,
      profitOrLoss,
      profitOrLossPercentage,
    };
  }

  private stockPrices: { [key: string]: number } = {
    AAPL: 120,
    MSFT: 210,
    GOOGL: 1500,
    AMZN: 3100,
    TSLA: 600,
  };

  // async getLatestStockPrice(stockSymbol: string): Promise<number> {
  getLatestStockPrice(stockSymbol: string): number {
    // Simulate fetching the latest stock price
    const price = this.stockPrices[stockSymbol];
    if (price !== undefined) {
      return price;
    } else {
      throw new Error(`Stock symbol ${stockSymbol} not found`);
    }
  }

  // async getLatestStockPrice(stockSymbol: string): Promise<number> {
  //   const API_KEY = process.env.TRADE_API_KEY; // Replace with your key
  //   const URL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`;

  //   try {
  //     const response = await fetch(URL);
  //     const data = await response.json();

  //     // Check if 'Global Quote' and '05. price' exist in the response
  //     if (data && data["Global Quote"] && data["Global Quote"]["05. price"]) {
  //       const price = data["Global Quote"]["05. price"];
  //       return parseFloat(price);
  //     } else {
  //       console.error(
  //         `Invalid response structure for ${stockSymbol}:`,
  //         JSON.stringify(data, null, 2)
  //       );
  //       throw new Error(`Failed to retrieve price for ${stockSymbol}`);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching stock price:", error);
  //     throw new Error("Failed to fetch stock price");
  //   }
  // }

  async calculatePortfolioMetrics(
    myTrades?: {
      price: number;
      quantity: number;
      tradeType: $Enums.TradeType;
      id: number;
      stockSymbol: string;
      date: Date;
      portfolioId: number;
    }[],
  ) {
    // Fetch all trades
    let trades = myTrades;
    if (!trades) {
      trades = await this.prisma.trade.findMany();
    }

    // Calculate total investment, total profit, and performance
    let totalInvestment = 0;
    let totalProfit = 0;

    trades?.forEach(
      (trade: { price: number; quantity: number; tradeType: string }) => {
        const tradeValue = trade.price * trade.quantity;
        if (trade.tradeType === 'BUY') {
          totalInvestment += tradeValue;
        } else if (trade.tradeType === 'SELL') {
          totalProfit += tradeValue;
        }
      },
    );

    const performance = totalInvestment
      ? ((totalProfit - totalInvestment) / totalInvestment) * 100
      : 0;

    return {
      totalInvestment,
      totalProfit,
      performance,
    };
  }
}
