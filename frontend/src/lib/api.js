"use server";

const API_BASE_URL = "http://localhost:3001";

/**
 * Fetch portfolio metrics
 */
export async function fetchPortfolioMetrics() {
  const response = await fetch(`${API_BASE_URL}/portfolio/metrics`, {
    cache: "force-cache",
    next: { revalidate: 1500, tags: ["metrics"] },
  });
  if (!response.ok) throw new Error("Failed to fetch portfolio metrics");
  return response.json();
}

/**
 * Fetch portfolio details
 */
export async function fetchPortfolio() {
  const response = await fetch(`${API_BASE_URL}/portfolio`, {
    cache: "force-cache",
    next: { revalidate: 1500, tags: ["portfolio"] },
  });
  if (!response.ok) throw new Error("Failed to fetch portfolio data");
  return response.json();
}

/**
 * Fetch all trades
 */
export async function fetchTrades() {
  const response = await fetch(`${API_BASE_URL}/trades`, {
    cache: "force-cache",
    next: { revalidate: 1500, tags: ["trades"] },
  });
  if (!response.ok) throw new Error("Failed to fetch trades");
  return response.json();
}

/**
 * Create a new trade
 */
export async function createTrade(trade) {
  const response = await fetch(`${API_BASE_URL}/trades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trade),
  });

  if (!response.ok) throw new Error("Failed to create trade");
  return response.json();
}
