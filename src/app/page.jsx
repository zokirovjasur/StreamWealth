"use client";
import React from "react";
import DashboardStats from "../components/DashboardStats";
import RecentTransactions from "../components/RecentTransactions";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <DashboardStats />
      <RecentTransactions />
    </div>
  );
}
