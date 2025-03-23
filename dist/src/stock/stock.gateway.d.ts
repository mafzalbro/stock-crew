import { OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class StockPriceGateway implements OnGatewayInit {
    server: Server;
    afterInit(): void;
    sendStockPriceUpdate(stockSymbol: string, price: number): void;
    sendPortfolioUpdate(portfolioId: number, data: any): void;
}
