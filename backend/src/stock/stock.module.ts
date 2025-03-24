import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockGateway } from './stock.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StockService, StockGateway],
})
export class StockModule {}
