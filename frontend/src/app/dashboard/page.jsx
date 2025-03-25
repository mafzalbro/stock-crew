"use client";

import { useEffect, useState } from "react";
import { fetchPortfolioMetrics } from "@/lib/api";
import PortfolioCard from "@/components/PortfolioCard";
import StockChart from "@/components/StockChart";
import StockVisualization from "@/components/StockVisualization";
import Link from "next/link";
import SkeletonCard from "@/components/SkeletonCard";
import { FiChevronRight } from "react-icons/fi";
import ButtonLink from "@/components/ButtonLink";
export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [stockPerformance, setStockPerformance] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      const data = await fetchPortfolioMetrics();
      setMetrics(data);
      setStockPerformance(data);
    }

    loadMetrics();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold my-10">📈 Dashboard</h1>
        <ButtonLink href="/dashboard/portfolio">
          See Portfolio <FiChevronRight />
        </ButtonLink>
      </div>
      {metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <PortfolioCard
            title="💰 Total Investment"
            value={`$${metrics.totalInvestment?.toFixed(2)}`}
          />
          <PortfolioCard
            title="📊 Total Profit"
            value={`$${metrics.totalProfit?.toFixed(2)}`}
          />
          <PortfolioCard
            title="📉 Performance"
            value={`${metrics?.performance?.toFixed(2)}%`}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
      <StockVisualization />
    </div>
  );
}
