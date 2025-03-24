// src/trade/trade.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TradeService {
  constructor(private prisma: PrismaService) {}

  async createTrade(data: Prisma.TradeCreateInput) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: data?.portfolio?.connect?.id },
      include: { trades: true },
    });

    if (!portfolio) throw new Error('Portfolio not found');

    // Ensure there are enough stocks to sell
    if (data.tradeType === 'SELL') {
      const totalOwned = portfolio.trades
        .filter(
          (t) => t.stockSymbol === data.stockSymbol && t.tradeType === 'BUY',
        )
        .reduce((sum, t) => sum + t.quantity, 0);

      if (totalOwned < data.quantity) {
        throw new Error('Not enough stock to sell');
      }
    }

    return this.prisma.trade.create({ data });
  }

  async getAllTrades() {
    return await this.prisma.trade.findMany();
  }

  // Additional methods for retrieving, updating, and deleting trades
}
