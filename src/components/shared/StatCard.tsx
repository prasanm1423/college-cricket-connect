
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, className, trend }: StatCardProps) => {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <p
              className={cn(
                "text-xs font-medium mt-1",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </p>
          )}
        </div>
        {icon && <div className="text-cricket-green-dark">{icon}</div>}
      </div>
    </Card>
  );
};

export default StatCard;
