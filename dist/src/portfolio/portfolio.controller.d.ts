import { PortfolioService } from './portfolio.service';
import { Prisma } from '@prisma/client';
export declare class PortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: PortfolioService);
    getPortfolioMetrics(): Promise<{
        totalInvestment: number;
        totalProfit: number;
        performance: number;
    }>;
    createPortfolio(data: Prisma.PortfolioCreateInput): Promise<{
        name: string;
        id: number;
        userId: number;
    }>;
    getAllPortfolios(): Promise<any[]>;
    getPortfolioById(id: number): Promise<{
        totalInvestment: number;
        totalCurrentValue: number;
        profitOrLoss: number;
        profitOrLossPercentage: number;
        trades?: {
            id: number;
            stockSymbol: string;
            quantity: number;
            price: number;
            tradeType: import(".prisma/client").$Enums.TradeType;
            date: Date;
            portfolioId: number;
        }[] | undefined;
        name?: string | undefined;
        id?: number | undefined;
        userId?: number | undefined;
    }>;
    getPortfolioSummary(id: number): Promise<{
        totalInvestment: number;
        totalCurrentValue: number;
        profitOrLoss: number;
        profitOrLossPercentage: number;
    }>;
}
