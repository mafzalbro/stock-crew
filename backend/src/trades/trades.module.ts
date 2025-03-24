import { Module } from '@nestjs/common';
import { TradeController } from './trades.controller';
import { TradeService } from './trades.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [TradeService, PrismaService],
  controllers: [TradeController],
})
export class TradeModule {}
