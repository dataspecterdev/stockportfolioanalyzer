import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { StockPosition } from "../types/portfolio";

interface PerformanceChartProps {
  positions: StockPosition[];
}

export function PerformanceChart({ positions }: PerformanceChartProps) {
  const chartData = positions
    .map((pos) => ({
      symbol: pos.stock.symbol,
      return: pos.gainPercentage,
      value: pos.gain,
    }))
    .sort((a, b) => b.return - a.return);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="mb-4">Individual Stock Performance</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="symbol" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "return") {
                return [`${value.toFixed(2)}%`, "Return"];
              }
              return [
                `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                "Gain/Loss"
              ];
            }}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="return" name="Return (%)" radius={[8, 8, 0, 0]} animationDuration={1000}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.return >= 0 ? "#10b981" : "#ef4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
