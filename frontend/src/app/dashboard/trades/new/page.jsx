// File: app/dashboard/trades/new/page.js

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTrade() {
  const router = useRouter();
  const [trade, setTrade] = useState({
    stockSymbol: "",
    type: "buy",
    quantity: "",
    price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/trades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trade),
    });

    if (response.ok) {
      router.push("/dashboard/trades");
    } else {
      // Handle error
      console.error("Failed to create trade");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">New Trade</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Stock Symbol</label>
          <input
            type="text"
            value={trade.stockSymbol}
            onChange={(e) =>
              setTrade({ ...trade, stockSymbol: e.target.value })
            }
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select
            value={trade.type}
            onChange={(e) => setTrade({ ...trade, type: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={trade.quantity}
            onChange={(e) => setTrade({ ...trade, quantity: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={trade.price}
            onChange={(e) => setTrade({ ...trade, price: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
