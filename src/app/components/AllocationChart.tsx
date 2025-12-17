import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { StockPosition } from "../types/portfolio";

interface AllocationChartProps {
  positions: StockPosition[];
}

const COLORS = [
  "#2563eb", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#6366f1", // indigo
];

export function AllocationChart({ positions }: AllocationChartProps) {
  const chartData = positions.map((pos) => ({
    name: pos.stock.symbol,
    value: pos.currentValue,
    weight: pos.weight,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="mb-4">Portfolio Allocation</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, weight }) => `${name}: ${weight.toFixed(1)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              "Value"
            ]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
