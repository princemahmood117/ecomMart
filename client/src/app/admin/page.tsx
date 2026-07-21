"use client";

import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const dailyChartData = [
    ["Date", "Earnings"],
    ...stats.daily.map((d: any) => [d.date, d.total]),
  ];

  const monthlyChartData = [
    ["Month", "Earnings"],
    ...stats.monthly.map((m: any) => [m.month, m.total]),
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-6">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-semibold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white border rounded-xl p-6">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-semibold">{stats.totalOrders}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <p className="font-medium mb-4">Daily Earnings (last 14 days)</p>
        <Chart
          chartType="LineChart"
          width="100%"
          height="300px"
          data={dailyChartData}
          options={{ legend: { position: "none" }, colors: ["#e8a0bf"] }}
        />
      </div>

      <div className="bg-white border rounded-xl p-6">
        <p className="font-medium mb-4">Monthly Earnings</p>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="300px"
          data={monthlyChartData}
          options={{ legend: { position: "none" }, colors: ["#2b1d24"] }}
        />
      </div>
    </div>
  );
}