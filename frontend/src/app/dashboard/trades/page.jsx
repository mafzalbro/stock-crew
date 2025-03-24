"use client";
import { useEffect, useState } from "react";
import { fetchTrades } from "@/lib/api";
import TradeForm from "@/components/TradeForm";

export default function Trades() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    async function loadTrades() {
      const data = await fetchTrades();
      console.log({ data });

      setTrades(data);
    }
    loadTrades();
  }, []);

  return (
    <div className="p-6">
      <TradeForm />
      <h1 className="text-2xl font-bold">📜 Trade History</h1>
      <ul className="mt-4">
        {trades.map((trade) => (
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
  );
}
