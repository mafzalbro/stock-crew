"use client";
import { useState, useEffect } from "react";
import { fetchPortfolio } from "@/lib/api";
import PortfolioCard from "@/components/PortfolioCard";
import io from "socket.io-client";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [prices, setPrices] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      const data = await fetchPortfolio();
      console.log({ data });

      setPortfolio(data);
      setLoadingPortfolio(false);
    }
    loadPortfolio();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("stockPriceUpdate", ({ stockSymbol, price }) => {
      setPrices((prevPrices) => ({
        ...prevPrices,
        [stockSymbol]: price,
      }));
      setLoadingPrices(false);
    });

    return () => {
      socket.off("stockPriceUpdate");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="sm:p-6 p-4">
      <h1 className="text-2xl font-bold">📦 Portfolio</h1>

      {/* Real-Time Stock Prices Section */}
      <div className="border border-gray-900 my-10 rounded-lg sm:p-8 min-h-40">
        <div className="mb-6">
          <ButtonLink href="/dashboard" className="inline-flex">
            <FiChevronLeft /> Back To Dashboard
          </ButtonLink>
        </div>
        <span className="text-blue-500">Real-Time</span>
        <h2 className="text-3xl">Stock Prices</h2>

        <ul className="flex sm:justify-evenly sm:items-center flex-wrap gap-2 my-10">
          {loadingPrices ? (
            // Skeleton for stock prices
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="sm:w-1/4 w-full bg-gray-800 animate-pulse h-24 rounded-3xl"
              ></div>
            ))
          ) : Object.keys(prices).length > 0 ? (
            Object.entries(prices).map(([symbol, price]) => (
              <PortfolioCard
                className="w-1/4 bg-transparent"
                key={symbol}
                title={symbol}
                value={price?.toFixed(2)}
              />
            ))
          ) : (
            <li>Loading...</li>
          )}
        </ul>
      </div>

      {/* Portfolio Cards */}
      {loadingPortfolio ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Skeleton Loaders for Portfolio */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="p-8 bg-gray-800 animate-pulse rounded-3xl h-32"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {portfolio.map((stock) => (
            <Link
              href={`/dashboard/portfolio/${stock.id}`}
              key={stock.id}
              className="relative group !transition-all duration-1000"
            >
              <FiChevronRight className="absolute bottom-4 right-4 hidden group-hover:block scale-60 group-hover:scale-110" />
              <PortfolioCard
                title={stock.name}
                value={`$${stock.value?.toFixed(2)}`}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
