import { useEffect, useState } from "react";
import { fetchPortfolioMetrics } from "@/lib/api";

export default function useFetchPortfolio() {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const response = await fetchPortfolioMetrics();
      setData(response);
    }
    fetchData();
  }, []);
  return data;
}
