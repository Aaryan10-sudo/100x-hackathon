"use client";

import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample data
const salesData = [
  { month: "Jan", sales: 4000, revenue: 2400 },
  { month: "Feb", sales: 3000, revenue: 1398 },
  { month: "Mar", sales: 2000, revenue: 9800 },
  { month: "Apr", sales: 2780, revenue: 3908 },
  { month: "May", sales: 1890, revenue: 4800 },
  { month: "Jun", sales: 2390, revenue: 3800 },
];

const productData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Books", value: 200 },
  { name: "Others", value: 100 },
];

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#ec4899"];

// Simple Card Component (replacing shadcn Card)
const CustomCard = ({ title, value, footer, children }) => (
  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg">
    <div className="pb-3">
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    {footer && (
      <p
        className={`text-xs ${
          footer.includes("+") ? "text-green-400" : "text-orange-400"
        } mt-1`}
      >
        {footer}
      </p>
    )}
    {children}
  </div>
);

// Simple Chart Wrapper (replacing CardHeader and CardContent)
const ChartWrapper = ({ title, children }) => (
  <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg">
    <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

export default function Analytics() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">
          Track your store performance and insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CustomCard
          title="Total Sales"
          value="15,240"
          footer="+12% from last month"
        />
        <CustomCard
          title="Total Revenue"
          value="$42,650"
          footer="+8% from last month"
        />
        <CustomCard
          title="Products Sold"
          value="1,240"
          footer="+15% from last month"
        />
        <CustomCard title="Active Orders" value="324" footer="12 pending" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Revenue Chart */}
        <ChartWrapper title="Sales & Revenue Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: "#06b6d4" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Monthly Sales Chart */}
        <ChartWrapper title="Monthly Sales Overview">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" />
              <Bar dataKey="revenue" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Product Distribution */}
      <ChartWrapper title="Product Category Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={productData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100} // Increased size slightly
              fill="#8884d8"
              dataKey="value"
            >
              {productData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
