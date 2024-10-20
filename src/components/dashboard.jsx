import React from "react";
import Sidebar from "./sidebar";
import DashboardContent from "./dsahboardcontent";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;
