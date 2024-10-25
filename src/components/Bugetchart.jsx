import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const BudgetChart = ({ budgetData, expenseData }) => {
  // Prepare the data for the chart
  const chartData = {
    labels: budgetData.map(b => b.title), // Titles of budgets
    datasets: [
      {
        label: 'Total Amount',
        data: budgetData.map(b => b.totalAmount), // Total amounts of budgets
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Remaining Amount',
        data: budgetData.map(b => b.remaining), // Remaining amounts of budgets
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  useEffect(() => {
    return () => {
      // Optional cleanup if needed
    };
  }, []);

  return (
    <div id='budgetChart'>
      <h2>Budget Overview</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BudgetChart;
