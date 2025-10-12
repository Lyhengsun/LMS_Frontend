"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { CourseStatusCounts } from "@/src/type/Dashboard";

interface CourseStatusData {
  name: string;
  value: number;
  color: string;
}

interface CourseStatusPieChartProps {
  statusCounts: CourseStatusCounts;
}

const STATUS_CONFIG = {
  published: { label: "Published", color: "#22c55e" },
  draft: { label: "Draft", color: "#94a3b8" },
  pending: { label: "Pending", color: "#eab308" },
  rejected: { label: "Rejected", color: "#ef4444" },
};

export function CourseStatusPieChart({ statusCounts }: CourseStatusPieChartProps) {
  // Transform the object into chart data
  const data: CourseStatusData[] = Object.entries(statusCounts)
    .map(([key, value]) => ({
      name: STATUS_CONFIG[key as keyof CourseStatusCounts].label,
      value: value,
      color: STATUS_CONFIG[key as keyof CourseStatusCounts].color,
    }))
    .filter((item) => item.value > 0); // Only show categories with courses

  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardContent>
        <div className="text-xl font-semibold mb-4">
          Course Status Distribution
        </div>
        {total > 0 ? (
          <ResponsiveContainer width="100%" height={390}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No course data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
