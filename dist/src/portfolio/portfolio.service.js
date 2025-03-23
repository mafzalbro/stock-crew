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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PortfolioService = class PortfolioService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPortfolio(data) {
        return await this.prisma.portfolio.create({
            data,
        });
    }
    async getAllPortfolios() {
        const portfolios = await this.prisma.portfolio.findMany({});
        const portfoliosWithSummary = [];
        for (const portfolio of portfolios) {
            const summary = await this.getPortfolioSummary(portfolio.id);
            portfoliosWithSummary.push({
                ...portfolio,
                value: summary.totalCurrentValue,
                ...summary,
            });
        }
        return portfoliosWithSummary;
    }
    async getPortfolioById(portfolioId) {
        const summary = await this.getPortfolioSummary(portfolioId);
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
            include: { trades: true },
        });
        return { ...portfolio, ...summary };
    }
    async getPortfolioSummary(portfolioId) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: portfolioId },
            include: { trades: true },
        });
        if (!portfolio)
            throw new Error('Portfolio not found');
        let totalInvestment = 0;
        let totalCurrentValue = 0;
        for (const trade of portfolio.trades) {
            const latestPrice = this.getLatestStockPrice(trade.stockSymbol);
            if (trade.tradeType === 'BUY') {
                totalInvestment += trade.price * trade.quantity;
                totalCurrentValue += latestPrice * trade.quantity;
            }
            else if (trade.tradeType === 'SELL') {
                totalInvestment -= trade.price * trade.quantity;
                totalCurrentValue -= latestPrice * trade.quantity;
            }
        }
        const profitOrLoss = totalCurrentValue - totalInvestment;
        const profitOrLossPercentage = (profitOrLoss / totalInvestment) * 100 || 0;
        return {
            totalInvestment,
            totalCurrentValue,
            profitOrLoss,
            profitOrLossPercentage,
        };
    }
    stockPrices = {
        AAPL: 120,
        MSFT: 210,
        GOOGL: 1500,
        AMZN: 3100,
        TSLA: 600,
    };
    getLatestStockPrice(stockSymbol) {
        const price = this.stockPrices[stockSymbol];
        if (price !== undefined) {
            return price;
        }
        else {
            throw new Error(`Stock symbol ${stockSymbol} not found`);
        }
    }
    async calculatePortfolioMetrics(myTrades) {
        let trades = myTrades;
        if (!trades) {
            trades = await this.prisma.trade.findMany();
        }
        let totalInvestment = 0;
        let totalProfit = 0;
        trades?.forEach((trade) => {
            const tradeValue = trade.price * trade.quantity;
            if (trade.tradeType === 'BUY') {
                totalInvestment += tradeValue;
            }
            else if (trade.tradeType === 'SELL') {
                totalProfit += tradeValue;
            }
        });
        const performance = totalInvestment
            ? ((totalProfit - totalInvestment) / totalInvestment) * 100
            : 0;
        return {
            totalInvestment,
            totalProfit,
            performance,
        };
    }
};
exports.PortfolioService = PortfolioService;
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PortfolioService.prototype, "createPortfolio", null);
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map