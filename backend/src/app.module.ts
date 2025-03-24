import { Module } from '@nestjs/common';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TradeModule } from './trades/trades.module';
import { StockModule } from './stock/stock.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PortfolioModule, TradeModule, StockModule, PrismaModule],
})
export class AppModule {}
