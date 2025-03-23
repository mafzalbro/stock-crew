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
exports.TradeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TradeService = class TradeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTrade(data) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id: data?.portfolio?.connect?.id },
            include: { trades: true },
        });
        if (!portfolio)
            throw new Error('Portfolio not found');
        if (data.tradeType === 'SELL') {
            const totalOwned = portfolio.trades
                .filter((t) => t.stockSymbol === data.stockSymbol && t.tradeType === 'BUY')
                .reduce((sum, t) => sum + t.quantity, 0);
            if (totalOwned < data.quantity) {
                throw new Error('Not enough stock to sell');
            }
        }
        return this.prisma.trade.create({ data });
    }
    async getAllTrades() {
        return await this.prisma.trade.findMany();
    }
};
exports.TradeService = TradeService;
exports.TradeService = TradeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TradeService);
//# sourceMappingURL=trades.service.js.map