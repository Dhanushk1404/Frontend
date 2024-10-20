import React from "react";
import ActivityChart from "./Activitychart";
import { FiDollarSign, FiClipboard, FiCreditCard  } from "react-icons/fi";

const DashboardContent = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Hi, Game Play ✌️</h1>
        <p className="text-gray-500">Here's what's happening with your money. Let's manage your expense.</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Budget</p>
            <h3 className="text-2xl font-bold">$15100</h3>
          </div>
          <FiDollarSign className="text-blue-500 text-3xl" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Spend</p>
            <h3 className="text-2xl font-bold">$4830</h3>
          </div>
          <FiClipboard className="text-blue-500 text-3xl" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-gray-500">No. of Budget</p>
            <h3 className="text-2xl font-bold">5</h3>
          </div>
          <FiCreditCard className="text-blue-500 text-3xl" />
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Activity</h3>
        <ActivityChart />
      </div>

      {/* Latest Budgets */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Latest Budgets</h3>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>Shopping</p>
              <p className="text-gray-500 text-sm">1 Item</p>
            </div>
            <div className="text-xl font-bold">$2300</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p>Home Decor</p>
              <p className="text-gray-500 text-sm">3 Items</p>
            </div>
            <div className="text-xl font-bold">$3800</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
