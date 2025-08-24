"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Film, DollarSign, Ticket } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", bookings: 20 },
  { name: "Feb", bookings: 35 },
  { name: "Mar", bookings: 50 },
  { name: "Apr", bookings: 45 },
];

const OwnerDashboard = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Owner Dashboard</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Shows"
          value="12"
          icon={<Film className="text-green-600 w-6 h-6" />}
        />
        <DashboardCard
          title="Bookings"
          value="320"
          icon={<Ticket className="text-blue-600 w-6 h-6" />}
        />
        <DashboardCard
          title="Revenue"
          value="$3,500"
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
            <Bar dataKey="bookings" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Owner Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Owner Controls
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Add / Edit Shows</li>
          <li>• View Bookings</li>
          <li>• Track Revenue</li>
          <li>• Manage Theater Settings</li>
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

export default OwnerDashboard;
