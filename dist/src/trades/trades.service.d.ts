import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class TradeService {
    private prisma;
    constructor(prisma: PrismaService);
    createTrade(data: Prisma.TradeCreateInput): Promise<{
        id: number;
        stockSymbol: string;
        quantity: number;
        price: number;
        tradeType: import(".prisma/client").$Enums.TradeType;
        date: Date;
        portfolioId: number;
    }>;
    getAllTrades(): Promise<{
        id: number;
        stockSymbol: string;
        quantity: number;
        price: number;
        tradeType: import(".prisma/client").$Enums.TradeType;
        date: Date;
        portfolioId: number;
    }[]>;
}
