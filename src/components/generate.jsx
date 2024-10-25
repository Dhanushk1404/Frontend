import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import BudgetChart from './Bugetchart'; 
import html2canvas from 'html2canvas';


const GenerateReport = () => {
    const [expenses, setExpenses] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [months] = useState([
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ]);
    const [years] = useState([
        { value: '2023', label: '2023' },
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' },
        // Add more years as needed
    ]);
    const [budgetData, setBudgetData] = useState([]); // Define budgetData state

    const loadRecentExpenses = async (uid) => {
        try {
            const response = await axios.get(`http://localhost:5000/getlatestexpenses?user=${uid}`);
            setExpenses(response.data);
        } catch (err) {
            console.error("Error fetching recent expenses:", err);
            setError("Failed to load expenses.");
        } finally {
            setLoading(false);
        }
    };

    const fetchBudgetData = async (uid,monthYear) => {
        try {
            const response = await axios.get(`http://localhost:5000/getbudgetdata?user=${uid}&month=${monthYear}`);
            const budgets = response.data; // Assuming the response is the array of budgets directly
    
            console.log(budgets);
            setBudgetData(budgets || []); // Set budgetDetails to the response data
    
            // Initialize totals
            let totalBudget = 0;
            let totalSpent = 0;
    
            // Iterate through budgets to sum amounts
            budgets.forEach(budget => {
                totalBudget += budget.totalAmount; // Sum totalAmount
                totalSpent += budget.totalSpent; // Sum totalSpent
            });
    
            // Calculate remaining amount
            const remainingAmount = totalBudget - totalSpent;
    
            // Update state with calculated totals
            setTotalBudget(totalBudget);
            setTotalSpent(totalSpent);
            setRemainingAmount(remainingAmount);
        } catch (err) {
            console.error("Error fetching budget data:", err);
            setError("Failed to load budget data.");
        }
    };
    

    const fetchMonthlyExpenses = async (month, year) => {
        const monthYear = `${year}-${month}`; 
        fetchBudgetData(userId,monthYear);
        try {
            const response = await axios.get(`http://localhost:5000/getexpensesbymonth?user=${userId}&month=${monthYear}`);
            if (typeof response.data === 'string' && response.data === "No expenses found") {
                setMonthlyExpenses([]);
                setError("No expenses found for the selected month and year.");
            } else {
                setMonthlyExpenses(response.data);
                setError(null);
            }
        } catch (err) {
            console.error("Error fetching monthly expenses:", err);
            setError("Failed to load monthly expenses.");
        }
    };

    const generateReport = async () => {
        if (!monthlyExpenses || !Array.isArray(monthlyExpenses) || monthlyExpenses.length === 0) return; 
    
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Hello ${userEmail}`, 14, 10);
        doc.setFontSize(16);
        doc.text("Monthly Expense Report", 14, 22);
        doc.setFontSize(12);
        doc.text(`Report for: ${months.find(m => m.value === selectedMonth)?.label || 'Unknown'} ${selectedYear}`, 14, 30);
    
        // Adding total budget, total spent, and remaining amount
        doc.setFontSize(14);
        doc.text(`Total Budget: $${totalBudget}`, 14, 40);
        doc.text(`Total Spent: $${totalSpent}`, 14, 48);
        doc.text(`Remaining Amount: $${remainingAmount}`, 14, 56);
    
        // Add the chart as an image to the PDF (if available)
        const chartElement = document.getElementById('budgetChart'); // Ensure your chart component has this ID
    
        if (chartElement) {
            try {
                const canvas = await html2canvas(chartElement); // Wait for canvas to be generated
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 14, 60, 180, 100); // Adjust position and size as needed
    
                // Adding the expenses table after the chart
                const tableData = monthlyExpenses.map(expense => [
                    `$${expense.amount}`,
                    expense.description,
                    new Date(expense.date).toLocaleDateString(),
                    expense.budget ? expense.budget.title : 'N/A',
                ]);
    
                doc.autoTable({
                    head: [['Amount', 'Description', 'Date', 'Budget Title']],
                    body: tableData,
                    startY: 170, // Adjust Y position if chart is added above
                });
    
                // Save the PDF only after everything is added
                doc.save(`Monthly_Expense_Report_${selectedYear}_${selectedMonth}.pdf`);
            } catch (error) {
                console.error("Error generating chart image:", error);
            }
        } else {
            console.error("Chart element not found");
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUserId(firebaseUser.uid);
                setUserEmail(firebaseUser.email);
            } else {
                console.error("No user is logged in");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userId) {
            loadRecentExpenses(userId);
        }
    }, [userId]);

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Recent Expenses</h1>

                <h2 className="text-lg font-semibold text-blue-600">Welcome, {userEmail}</h2>
                <div className="mb-4">
                    <p>Total Budgets: ${totalBudget}</p>
                    <p>Total Spent: ${totalSpent}</p>
                    <p>Remaining Amount: ${remainingAmount}</p>
                </div>

                {/* Month and Year Selection, Fetch Buttons */}
                <div className="mb-6">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        <option value="">Select Month</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {years.map((year) => (
                            <option key={year.value} value={year.value}>
                                {year.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => fetchMonthlyExpenses(selectedMonth, selectedYear)}
                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Fetch Monthly Expenses
                    </button>
                    <button
                        onClick={generateReport}
                        className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Generate Report
                    </button>
                </div>

                {/* Chart */}
                {budgetData && Array.isArray(budgetData) && budgetData.length > 0 && <BudgetChart budgetData={budgetData} expenseData={monthlyExpenses} />}

                {/* Expenses Table */}
                <div className="overflow-x-auto">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Monthly Expenses</h2>
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Amount</th>
                                <th className="border border-gray-300 px-4 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                <th className="border border-gray-300 px-4 py-2">Budget Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyExpenses.length > 0 ? (
                                monthlyExpenses.map((expense, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-4 py-2">${expense.amount}</td>
                                        <td className="border border-gray-300 px-4 py-2">{expense.description}</td>
                                        <td className="border border-gray-300 px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="border border-gray-300 px-4 py-2">{expense.budget ? expense.budget.title : 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">No expenses found for the selected month.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {error && <p className="text-red-600">{error}</p>} {/* Display error message */}
            </div>
        </Layout>
    );
};

export default GenerateReport;
