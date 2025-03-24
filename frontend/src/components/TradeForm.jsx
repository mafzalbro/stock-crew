"use client";
import { useState } from "react";
import { createTrade } from "@/lib/api";

export default function TradeForm() {
  const [trade, setTrade] = useState({
    stock: "",
    type: "buy",
    price: "",
    quantity: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTrade(trade);
    setTrade({ stock: "", type: "buy", price: "", quantity: "" });
  };

  return (
    <form
      className="bg-gray-950 p-6 rounded-3xl shadow-lg border border-gray-700 max-w-lg mx-auto my-20"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-semibold text-white mb-4">📊 Trade Stocks</h2>

      <div className="flex flex-col gap-4">
        {/* Stock Name Input */}
        <input
          type="text"
          placeholder="Stock Name (e.g. AAPL)"
          value={trade.stock}
          onChange={(e) => setTrade({ ...trade, stock: e.target.value })}
          className="p-3 bg-gray-900 border border-gray-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Trade Type Selection */}
        <select
          value={trade.type}
          onChange={(e) => setTrade({ ...trade, type: e.target.value })}
          className="p-3 bg-gray-900 border-transparent border-r-10 outline outline-gray-800  rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>

        {/* Price Input */}
        <input
          type="number"
          placeholder="Price (e.g. 150)"
          value={trade.price}
          onChange={(e) => setTrade({ ...trade, price: e.target.value })}
          className="p-3 bg-gray-900 border border-gray-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Quantity Input */}
        <input
          type="number"
          placeholder="Quantity"
          value={trade.quantity}
          onChange={(e) => setTrade({ ...trade, quantity: e.target.value })}
          className="p-3 bg-gray-900 border border-gray-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            !trade.stock || !trade.type || !trade.price || !trade.quantity
          }
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white py-3 rounded-2xl font-medium transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
        >
          Submit Trade
        </button>
      </div>
    </form>
  );
}
