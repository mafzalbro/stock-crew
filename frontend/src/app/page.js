"use client";
import { useEffect, useState } from "react";
import axios from "axios";
// import { calculatePortfolioMetrics } from "@/utils/calculatePortfolioMetrics";
import { useRouter } from "next/navigation";

export default function Home() {
  // const [portfolioMetrics, setPortfolioMetrics] = useState([]);
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
    // axios
    //   .get("http://localhost:3001/portfolio")
    //   .then((res) => {
    //     const portfolioData = res.data[0];
    //     const metrics = calculatePortfolioMetrics(portfolioData);

    //     setPortfolioMetrics(metrics || []);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching portfolio data:", error);
    //   });
  }, [router]);

  // console.log(portfolioMetrics);

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-10 flex justify-center items-center">
        Loading...
      </div>
      {/* <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-4">📊 Portfolio Summary</h1>
      <table className="w-full border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3">Stock</th>
            <th className="p-3">Total Investment</th>
            <th className="p-3">Profit</th>
          </tr>
        </thead>
        <tbody>
          {portfolioMetrics?.map((stock) => (
            <tr key={stock.stockSymbol} className="border-b border-gray-700">
              <td className="p-3">{stock.stockSymbol}</td>
              <td className="p-3">${stock.totalInvestment.toFixed(2)}</td>
              <td
                className={`p-3 ${
                  stock.totalProfit >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ${stock.totalProfit.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div> */}
    </>
  );
}
