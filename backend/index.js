/* eslint-disable @typescript-eslint/no-misused-promises */

import { PrismaClient, TradeType } from '@prisma/client';

const prisma = new PrismaClient();

// Define a list of real stock symbols and their base prices
const stockData = [
  { symbol: 'AAPL', basePrice: 135 },
  { symbol: 'MSFT', basePrice: 240 },
  { symbol: 'GOOGL', basePrice: 2750 },
  { symbol: 'AMZN', basePrice: 3300 },
  { symbol: 'TSLA', basePrice: 700 },
];

// Function to generate a random number following a Gaussian distribution
function gaussianRandom(mean, stdDev) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // Convert [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return (
    mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  );
}

async function seed() {
  // Clear existing data
  await prisma.trade.deleteMany({});
  await prisma.portfolio.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users with portfolios and trades
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
                  const tradeType =
                    Math.random() > 0.5 ? TradeType.BUY : TradeType.SELL;
                  const priceFluctuation = gaussianRandom(
                    0,
                    stock.basePrice * 0.05,
                  ); // 5% std dev
                  const price = parseFloat(
                    (stock.basePrice + priceFluctuation).toFixed(2),
                  );
                  const quantity = Math.floor(Math.random() * 91) + 10; // Random quantity between 10 and 100
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
