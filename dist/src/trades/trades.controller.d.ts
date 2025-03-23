import { TradeService } from './trades.service';
export declare class TradeController {
    private readonly tradeService;
    constructor(tradeService: TradeService);
    createTrade(tradeData: any): Promise<{
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
