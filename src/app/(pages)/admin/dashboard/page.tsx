"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User, Film, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", bookings: 40 },
  { name: "Feb", bookings: 55 },
  { name: "Mar", bookings: 80 },
  { name: "Apr", bookings: 65 },
];

const AdminDashboard = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Admin Dashboard</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Total Users"
          value="1,250"
          icon={<User className="text-blue-600 w-6 h-6" />}
        />
        <DashboardCard
          title="Total Theaters"
          value="45"
          icon={<Film className="text-green-600 w-6 h-6" />}
        />
        <DashboardCard
          title="Revenue"
          value="$12,500"
          icon={<DollarSign className="text-yellow-600 w-6 h-6" />}
        />
      </div>

      {/* Bookings Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Bookings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="#4F46E5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Admin Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Admin Controls
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Manage Theaters</li>
          <li>• Manage Users</li>
          <li>• View Website Analytics</li>
          <li>• Approve/Reject Theater Owners</li>
        </ul>
      </div>
    </div>
  );
};

// Reusable Card Component
const DashboardCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <Card className="p-4 shadow-md rounded-xl">
    <CardHeader className="flex justify-between items-center">
      <span className="text-gray-500 text-sm">{title}</span>
      {icon}
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default AdminDashboard;
