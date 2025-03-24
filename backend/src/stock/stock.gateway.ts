import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class StockGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  sendStockPriceUpdate(stockSymbol: string, price: number) {
    this.server.emit('stockPriceUpdate', { stockSymbol, price });
  }

  sendPortfolioUpdate(portfolioId: number, data: any) {
    this.server.emit('portfolioUpdate', { portfolioId, ...data });
  }
}
