import { PrismaService } from '../prisma/prisma.service';
import { StockPriceGateway } from '../stock/stock.gateway';
export declare class StockService {
    private readonly prisma;
    private readonly stockPriceGateway;
    getAllPortfolios(): void;
    private stockPrices;
    constructor(prisma: PrismaService, stockPriceGateway: StockPriceGateway);
    private initializeStockPrices;
    private startPriceSimulation;
    private startPortfolioUpdate;
    calculatePortfolioWorth(portfolioId: number): Promise<{
        portfolioId: number;
        portfolioWorth: number;
        totalInvestment: number;
        totalProfit: number;
    }>;
}
