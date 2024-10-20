import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FiPlus } from "react-icons/fi";
import axios from "axios";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newBudgetTitle, setNewBudgetTitle] = useState("");
  const [newBudgetTotalAmount, setNewBudgetTotalAmount] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        loadBudgets(firebaseUser.uid);
      } else {
        setUser(null);
        console.error("No user is logged in");
      }
    });
    return () => unsubscribe();
  }, []);

  const loadBudgets = async (uid) => {
    try {
      const response = await axios.get("http://localhost:5000/getbudgets", {
        params: { uid },
      });
      setBudgets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgets([]);
    }
  };

  const handleCreateBudget = async (event) => {
    event.preventDefault();
    try {
      if (!user || !user.uid) {
        console.error("User is not logged in or UID is undefined");
        return;
      }

      const newBudget = {
        uid: user.uid,
        title: newBudgetTitle,
        totalAmount: parseFloat(newBudgetTotalAmount),
        remaining: parseFloat(newBudgetTotalAmount),
        expenses: 0,
        createdAt: new Date().toISOString(),
      };

      await axios.post("http://localhost:5000/addbudget", newBudget);
      loadBudgets(user.uid);
      setNewBudgetTitle("");
      setNewBudgetTotalAmount("");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const handleAddExpense = async (event) => {
    event.preventDefault();
    try {
      const newExpense = {
        budgetId: selectedBudget._id,
        amount: parseFloat(expenseAmount),
        description: expenseDescription,
        date: new Date().toISOString(),
        userid: user.uid,
      };

      await axios.post("http://localhost:5000/addexpense", newExpense);
      loadBudgets(user.uid);
      setExpenseAmount("");
      setExpenseDescription("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Manage Your Budgets</h1>

      {/* Create New Budget Card */}
      <div
        className="border border-gray-300 bg-white shadow-md rounded-lg p-6 mb-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition"
        onClick={() => setShowForm(!showForm)}
      >
        <div className="flex items-center">
          <FiPlus className="mr-2 text-blue-600" size={24} />
          <span className="font-semibold text-gray-700 text-lg">Create New Budget</span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreateBudget} className="mb-6 bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Budget Title"
              value={newBudgetTitle}
              onChange={(e) => setNewBudgetTitle(e.target.value)}
              required
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            <input
              type="number"
              placeholder="Total Amount"
              value={newBudgetTotalAmount}
              onChange={(e) => setNewBudgetTotalAmount(e.target.value)}
              required
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-700 transition"
          >
            Add Budget
          </button>
        </form>
      )}

      {/* Display list of budgets as cards */}
      <h2 className="text-2xl font-semibold mb-4">Your Budgets</h2>
      {budgets.length === 0 ? (
        <p className="text-gray-600">No budgets available. Start by creating a new one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <div
              key={budget._id}
              className="bg-white border border-gray-300 shadow-md rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition"
              onClick={() => setSelectedBudget(budget)}
            >
              <h3 className="text-xl font-semibold mb-2">{budget.title}</h3>
              <p className="text-gray-600">Total Amount: ${budget.totalAmount}</p>
              <p className="text-gray-600">Remaining Amount: ${budget.remaining}</p>
              <p className="text-gray-600">Expenses: ${budget.expenses}</p>
              <p className="text-gray-500 text-sm">
                Created: {new Date(budget.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Display selected budget details and expense form */}
      {selectedBudget && (
        <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">{selectedBudget.title} - Details</h2>
          <p className="text-gray-700">Total Amount: ${selectedBudget.totalAmount}</p>
          <p className="text-gray-700">Remaining Amount: ${selectedBudget.remaining}</p>
          <p className="text-gray-700">Expenses: ${selectedBudget.expenses}</p>

          <form onSubmit={handleAddExpense} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Description"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                required
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
              <input
                type="number"
                placeholder="Amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                required
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white py-3 px-6 rounded-lg w-full hover:bg-green-700 transition"
            >
              Add Expense
            </button>
          </form>

          {/* Display expenses under the selected budget */}
          <h3 className="text-xl font-semibold mt-6">Expenses</h3>
          <ul className="mt-4">
            {selectedBudget.expenses && selectedBudget.expenses.length > 0 ? (
              selectedBudget.expenses.map((expense) => (
                <li key={expense._id} className="border p-4 mb-2 rounded-lg bg-gray-50">
                  <p className="text-gray-700">Description: {expense.description}</p>
                  <p className="text-gray-700">Amount: ${expense.amount}</p>
                  <p className="text-gray-500 text-sm">
                    Date: {new Date(expense.date).toLocaleDateString()}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No expenses available for this budget.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Budgets;
