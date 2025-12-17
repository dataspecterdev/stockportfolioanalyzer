import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  icon?: "trending" | "activity" | "target";
}

export function MetricCard({ title, value, subtitle, trend, icon }: MetricCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "trending":
        return trend === "down" ? <TrendingDown className="w-8 h-8" /> : <TrendingUp className="w-8 h-8" />;
      case "activity":
        return <Activity className="w-8 h-8" />;
      case "target":
        return <Target className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 mb-2">{title}</p>
          <p className={`text-3xl mb-1 ${getTrendColor()}`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={getTrendColor()}>
            {getIcon()}
          </div>
        )}
      </div>
    </div>
  );
}
