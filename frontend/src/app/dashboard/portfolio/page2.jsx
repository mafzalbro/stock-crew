// File: app/dashboard/portfolio/page.jsx

"use client";
import { useState, useEffect } from "react";
import { fetchPortfolio } from "@/lib/api";
import PortfolioCard from "@/components/PortfolioCard";

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    async function loadPortfolios() {
      const data = await fetchPortfolio();
      console.log({ data });

      setPortfolios(data);
    }
    loadPortfolios();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📦 Portfolios</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {portfolios.map((portfolio) => (
          <div key={portfolio.id} className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-semibold">{portfolio.name}</h2>
            <PortfolioCard
              title="💰 Total Investment"
              value={`$${portfolio.totalInvestment.toFixed(2)}`}
            />
            <PortfolioCard
              title="📊 Total Profit"
              value={`$${portfolio.totalProfit.toFixed(2)}`}
            />
            <PortfolioCard
              title="📈 Portfolio Value"
              value={`$${portfolio.portfolioValue.toFixed(2)}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
