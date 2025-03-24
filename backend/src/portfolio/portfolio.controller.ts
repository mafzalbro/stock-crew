import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Prisma } from '@prisma/client';
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('metrics')
  async getPortfolioMetrics() {
    return this.portfolioService.calculatePortfolioMetrics();
  }

  @Post()
  createPortfolio(@Body() data: Prisma.PortfolioCreateInput) {
    return this.portfolioService.createPortfolio(data);
  }

  @Get()
  async getAllPortfolios() {
    // const portfolios = await new PortfolioService(
    //   new PrismaService()
    // ).getAllPortfolios();
    // // return [{ name: "Portfolio 1" }, { name: "Portfolio 2" }];
    // return portfolios;
    // console.log(this.portfolioService, "portfolioService");

    return this.portfolioService.getAllPortfolios();
  }

  @Get(':id')
  async getPortfolioById(@Param('id', ParseIntPipe) id: number) {
    const portfolio = await this.portfolioService.getPortfolioById(id);
    return portfolio;
  }

  @Get(':id/summary')
  async getPortfolioSummary(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.getPortfolioSummary(id);
  }
}
