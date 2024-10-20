import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import { FiGrid, FiDollarSign, FiCreditCard, FiShield } from "react-icons/fi";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-full p-4">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 mb-10">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            className="mr-2"
          />
          <span>Logoipsum</span>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul>
          <li className="mb-6">
            <Link to="/" className="flex items-center text-blue-600 font-semibold">
              <FiGrid className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li className="mb-6">
            <Link to="/budgets" className="flex items-center">
              <FiDollarSign className="mr-3" />
              Budgets
            </Link>
          </li>
          <li className="mb-6">
            <Link to="/expenses" className="flex items-center">
              <FiCreditCard className="mr-3" />
              Expenses
            </Link>
          </li>
          <li>
            <Link to="/upgrade" className="flex items-center">
              <FiShield className="mr-3" />
              Upgrade
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="absolute bottom-6 left-4 flex items-center space-x-3">
        <div className="bg-green-500 h-10 w-10 rounded-full flex items-center justify-center text-white">
          G
        </div>
        <span>Profile</span>
      </div>
    </div>
  );
};

export default Sidebar;
