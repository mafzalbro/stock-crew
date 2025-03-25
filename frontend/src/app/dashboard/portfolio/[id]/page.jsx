// File: app/dashboard/portfolio/[id]/page.js

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PortfolioCard from "@/components/PortfolioCard";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import { FiChevronLeft } from "react-icons/fi";
import SkeletonCard from "@/components/SkeletonCard";

export default function PortfolioDetails() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    if (id) {
      async function fetchPortfolio() {
        const response = await fetch(`http://localhost:3001/portfolio/${id}`);
        const data = await response.json();
        console.log(data);

        setPortfolio(data);
      }
      fetchPortfolio();
    }
  }, [id]);

  if (!portfolio) {
    return (
      <div className="p-6">
        <span>
          <ButtonLink
            href={"/dashboard/portfolio"}
            className="text-blue-500 inline-flex"
          >
            <FiChevronLeft /> Back
          </ButtonLink>
        </span>
        <h1 className="text-2xl my-10 font-thin flex items-center">
          Portfolio Name:
          <div className="font-bold ml-2 h-8 w-40 bg-gray-900 animate-pulse rounded-3xl"></div>
        </h1>
        <div className="mt-4 flex items-center justify-evenly gap-2 mx-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} className="w-1/4" />
          ))}
        </div>
        <div>
          <h2 className="text-3xl my-8">Trades</h2>
          <ul className="p-2 bg-gray-900 shadow rounded my-2 mt-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="w-full h-8 mb-2 pb-2 animate-pulse" />
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <span>
        <ButtonLink
          href={"/dashboard/portfolio"}
          className="text-blue-500 inline-flex"
        >
          <FiChevronLeft /> Back
        </ButtonLink>
      </span>
      <h1 className="text-2xl my-10 font-thin">
        Portfolio Name:
        <span className="font-bold ml-2">{portfolio.name}</span>
      </h1>
      <div className="mt-4 flex items-center justify-evenly flex-wrap gap-2 mx-auto">
        <PortfolioCard
          className={"w-full sm:w-auto"}
          title="Total Investment"
          value={`$${portfolio.totalInvestment?.toFixed(2)}`}
        />
        <PortfolioCard
          className={"w-full sm:w-auto"}
          title="Total Profit or Loss"
          value={`$${portfolio.profitOrLoss?.toFixed(2)}`}
        />
        <PortfolioCard
          className={"w-full sm:w-auto"}
          title="Total Profit or Loss In Percentage"
          value={`${portfolio.profitOrLossPercentage?.toFixed(2)}%`}
        />
        <PortfolioCard
          className={"w-full sm:w-auto"}
          title="Portfolio Value"
          value={`${portfolio.totalCurrentValue?.toFixed(2)}`}
        />
      </div>

      <div>
        <h2 className="text-3xl my-8">Trades</h2>
        <ul className="mt-4">
          {portfolio.trades &&
            portfolio.trades.map((trade) => (
              <li
                key={trade.id}
                className="p-6 bg-gray-900 shadow my-2 rounded-3xl"
              >
                {trade.stockSymbol} - {trade.tradeType} - ${trade.price} @{" "}
                {trade.quantity}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
