"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PortfolioCard from "./PortfolioCard";

const socket = io("http://localhost:3001");

export default function StockVisualization() {
  const [stockHistory, setStockHistory] = useState({});

  useEffect(() => {
    socket.on("stockPriceUpdate", (data) => {
      setStockHistory((prevHistory) => {
        const { stockSymbol, price } = data;

        const newPoint = {
          stockSymbol,
          price,
          time: new Date().toLocaleTimeString(),
        };

        // Maintain a moving window of last 30 points for smooth scrolling
        const updatedHistory = {
          ...prevHistory,
          [stockSymbol]: [...(prevHistory[stockSymbol] || []), newPoint].slice(
            -30
          ),
        };

        return updatedHistory;
      });
    });

    return () => {
      socket.off("stockPriceUpdate");
    };
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-5xl text-center my-10">📈 Live Stock Market</h2>
      <div className="flex flex-wrap items-center justify-center gap-4 py-8">
        {Object.keys(stockHistory).map((symbol) => (
          <div
            key={symbol}
            className="mb-8 mx-0 w-full bg-gray-900 rounded-3xl py-4 px-10"
          >
            <PortfolioCard
              title={`${symbol} Price Movement`}
              titleClassName={"text-xl"}
              className={"mb-4 bg-transparent pl-0"}
            />
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockHistory[symbol]}>
                <XAxis dataKey="time" tick={{ fontSize: 12 }} interval={4} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "black",
                    border: "1px solid #333",
                    padding: "20px",
                    borderRadius: "20px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
