"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizPerformanceData {
  name: string;
  value: number;
  color: string;
}

interface QuizPerformancePieChartProps {
  passCount: number;
  failCount: number;
  passingThreshold?: number; // Default 70%
}

export function QuizPerformancePieChart({
  passCount,
  failCount,
  passingThreshold = 70,
}: QuizPerformancePieChartProps) {
  const data: QuizPerformanceData[] = [
    { name: "Pass", value: passCount, color: "#22c55e" },
    { name: "Fail", value: failCount, color: "#ef4444" },
  ].filter(item => item.value > 0);

  const total = passCount + failCount;
  const passRate = total > 0 ? ((passCount / total) * 100).toFixed(1) : "0";

  return (
    <Card>
      <CardContent>
        <div className="text-xl font-semibold">
          Quiz Performance 
        </div>
        {total > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No quiz attempt data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
