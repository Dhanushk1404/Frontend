import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

const ActivityChart = () => {
  const chartRef = useRef(null); // Use ref to store the chart instance
  const canvasRef = useRef(null); // Ref for the canvas

  useEffect(() => {
    Chart.register(...registerables);

    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy previous chart instance before creating a new one
    }

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Shopping", "Home Decor", "Garden", "Car", "Youtube"],
        datasets: [
          {
            label: "Total Spend",
            data: [2000, 6000, 1500, 3000, 5000],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Cleanup when component unmounts
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="h-64" id="activityChart"></canvas>;
};

export default ActivityChart;
