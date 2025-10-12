"use client";
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays, parseISO } from "date-fns";
import { DailyAttempt } from "@/src/type/Dashboard";


interface QuizAttemptsLineChartProps {
  dailyAttempts: DailyAttempt[];
  title?: string;
  defaultDays?: number; // Initial value for the selector
}

export function QuizAttemptsLineChart({
  dailyAttempts,
  title = "Quiz Attempts Over Time",
  defaultDays = 30,
}: QuizAttemptsLineChartProps) {
  const [daysToShow, setDaysToShow] = useState(defaultDays);

  // Filter and prepare data based on daysToShow
  const chartData = useMemo(() => {
    const currentDate = new Date();
    const startDate = subDays(currentDate, daysToShow - 1);

    return dailyAttempts
      .filter((attempt) => {
        const attemptDate = parseISO(attempt.date);
        return attemptDate >= startDate && attemptDate <= currentDate;
      })
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
      .map((attempt) => ({
        date: format(parseISO(attempt.date), "MMM dd"),
        fullDate: attempt.date,
        count: attempt.count,
      }));
  }, [dailyAttempts, daysToShow]);

  const totalAttempts = chartData.reduce((sum, item) => sum + item.count, 0);
  const averageAttempts = chartData.length > 0 
    ? (totalAttempts / chartData.length).toFixed(1) 
    : "0";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Select
            value={daysToShow.toString()}
            onValueChange={(value) => setDaysToShow(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="60">Last 60 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {totalAttempts} attempts • Average: {averageAttempts} per day
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={{ value: "Attempts", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">{payload[0].payload.fullDate}</p>
                        <p className="text-sm text-primary">
                          Attempts: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Quiz Attempts"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            No quiz attempt data available for the selected period
          </div>
        )}
      </CardContent>
    </Card>
  );
}