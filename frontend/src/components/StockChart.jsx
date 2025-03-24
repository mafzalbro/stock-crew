import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, Tooltip, Legend);

export default function StockChart({ metrics }) {
  const data = {
    labels: metrics?.dates || [],
    datasets: [
      {
        label: "Total Investment",
        data: metrics?.totalInvestments || [],
        borderColor: "#4A90E2",
        fill: false,
      },
      {
        label: "Total Profit",
        data: metrics?.totalProfits || [],
        borderColor: "#50E3C2",
        fill: false,
      },
      {
        label: "Performance",
        data: metrics?.performances || [],
        borderColor: "#F5A623",
        fill: false,
      },
    ],
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">📊 Performance Over Time</h2>
      <Line data={data} />
    </div>
  );
}
