import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';
export declare class PortfolioService {
    private prisma;
    constructor(prisma: PrismaService);
    createPortfolio(data: any): Promise<{
        name: string;
        id: number;
        userId: number;
    }>;
    getAllPortfolios(): Promise<any[]>;
    getPortfolioById(portfolioId: number): Promise<{
        totalInvestment: number;
        totalCurrentValue: number;
        profitOrLoss: number;
        profitOrLossPercentage: number;
        trades?: {
            id: number;
            stockSymbol: string;
            quantity: number;
            price: number;
            tradeType: $Enums.TradeType;
            date: Date;
            portfolioId: number;
        }[] | undefined;
        name?: string | undefined;
        id?: number | undefined;
        userId?: number | undefined;
    }>;
    getPortfolioSummary(portfolioId: number): Promise<{
        totalInvestment: number;
        totalCurrentValue: number;
        profitOrLoss: number;
        profitOrLossPercentage: number;
    }>;
    private stockPrices;
    getLatestStockPrice(stockSymbol: string): number;
    calculatePortfolioMetrics(myTrades?: {
        price: number;
        quantity: number;
        tradeType: $Enums.TradeType;
        id: number;
        stockSymbol: string;
        date: Date;
        portfolioId: number;
    }[]): Promise<{
        totalInvestment: number;
        totalProfit: number;
        performance: number;
    }>;
}
