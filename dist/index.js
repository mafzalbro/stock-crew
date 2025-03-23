"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const stockData = [
    { symbol: 'AAPL', basePrice: 135 },
    { symbol: 'MSFT', basePrice: 240 },
    { symbol: 'GOOGL', basePrice: 2750 },
    { symbol: 'AMZN', basePrice: 3300 },
    { symbol: 'TSLA', basePrice: 700 },
];
function gaussianRandom(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0)
        u = Math.random();
    while (v === 0)
        v = Math.random();
    return (mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v));
}
async function seed() {
    await prisma.trade.deleteMany({});
    await prisma.portfolio.deleteMany({});
    await prisma.user.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data: {
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`,
                portfolios: {
                    create: [
                        {
                            name: `Portfolio ${i + 1}`,
                            trades: {
                                create: stockData.map((stock) => {
                                    const tradeType = Math.random() > 0.5 ? client_1.TradeType.BUY : client_1.TradeType.SELL;
                                    const priceFluctuation = gaussianRandom(0, stock.basePrice * 0.05);
                                    const price = parseFloat((stock.basePrice + priceFluctuation).toFixed(2));
                                    const quantity = Math.floor(Math.random() * 91) + 10;
                                    return {
                                        stockSymbol: stock.symbol,
                                        price,
                                        quantity,
                                        tradeType,
                                    };
                                }),
                            },
                        },
                    ],
                },
            },
        });
        console.log(`Created user with id: ${user.id}`);
    }
}
seed()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=index.js.map