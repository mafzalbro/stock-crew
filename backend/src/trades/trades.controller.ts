import { Controller, Get, Post, Body } from '@nestjs/common';
import { TradeService } from './trades.service';
@Controller('trades')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post()
  createTrade(@Body() tradeData: any) {
    return this.tradeService.createTrade({
      ...tradeData,
      portfolio: { connect: { id: 1 } },
    });
  }

  @Get()
  getAllTrades() {
    return this.tradeService.getAllTrades();
  }
}
