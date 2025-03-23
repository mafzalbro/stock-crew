"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stock_gateway_1 = require("../stock/stock.gateway");
let StockService = class StockService {
    prisma;
    stockPriceGateway;
    getAllPortfolios() {
        throw new Error('Method not implemented.');
    }
    stockPrices = {
        AAPL: 120,
        MSFT: 210,
        GOOGL: 1500,
        AMZN: 3100,
        TSLA: 600,
    };
    constructor(prisma, stockPriceGateway) {
        this.prisma = prisma;
        this.stockPriceGateway = stockPriceGateway;
        this.initializeStockPrices();
        this.startPriceSimulation();
        this.startPortfolioUpdate();
    }
    async initializeStockPrices() {
        const trades = await this.prisma.trade.findMany({
            distinct: ['stockSymbol'],
            select: { stockSymbol: true, price: true },
        });
        trades.forEach((trade) => {
            this.stockPrices[trade.stockSymbol] = trade.price;
        });
    }
    startPriceSimulation() {
        console.log('Starting price simulation...');
        setInterval(() => {
            for (const symbol in this.stockPrices) {
                const S = this.stockPrices[symbol];
                const drift = 0.0001;
                const volatility = 0.01;
                const randomShock = Math.random() * volatility;
                const changeFactor = Math.exp(drift + randomShock);
                this.stockPrices[symbol] = parseFloat((S * changeFactor).toFixed(2));
                this.stockPriceGateway.sendStockPriceUpdate(symbol, this.stockPrices[symbol]);
            }
        }, 1000);
    }
    startPortfolioUpdate() {
        console.log('Starting portfolio update...');
        setInterval(async () => {
            const portfolios = await this.prisma.portfolio.findMany();
            for (const portfolio of portfolios) {
                const portfolioData = await this.calculatePortfolioWorth(portfolio.id);
                this.stockPriceGateway.sendPortfolioUpdate(portfolio.id, portfolioData);
            }
        }, 2000);
    }
    async calculatePortfolioWorth(portfolioId) {
        const trades = await this.prisma.trade.findMany({
            where: { portfolioId },
        });
        let totalInvestment = 0;
        let totalProfit = 0;
        const stockHoldings = {};
        for (const trade of trades) {
            const latestPrice = this.stockPrices[trade.stockSymbol] || trade.price;
            if (!stockHoldings[trade.stockSymbol]) {
                stockHoldings[trade.stockSymbol] = { quantity: 0, avgPrice: 0 };
            }
            if (trade.tradeType === 'BUY') {
                stockHoldings[trade.stockSymbol].quantity += trade.quantity;
                totalInvestment += trade.quantity * trade.price;
                stockHoldings[trade.stockSymbol].avgPrice =
                    (stockHoldings[trade.stockSymbol].avgPrice *
                        (stockHoldings[trade.stockSymbol].quantity - trade.quantity) +
                        trade.price * trade.quantity) /
                        stockHoldings[trade.stockSymbol].quantity;
            }
            else if (trade.tradeType === 'SELL') {
                stockHoldings[trade.stockSymbol].quantity -= trade.quantity;
                totalProfit += (latestPrice - trade.price) * trade.quantity;
            }
        }
        let portfolioWorth = 0;
        for (const symbol in stockHoldings) {
            portfolioWorth +=
                stockHoldings[symbol].quantity * (this.stockPrices[symbol] || 0);
        }
        return {
            portfolioId,
            portfolioWorth: parseFloat(portfolioWorth.toFixed(2)),
            totalInvestment: parseFloat(totalInvestment.toFixed(2)),
            totalProfit: parseFloat(totalProfit.toFixed(2)),
        };
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stock_gateway_1.StockPriceGateway])
], StockService);
//# sourceMappingURL=stock.service.js.map