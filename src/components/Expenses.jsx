import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const LatestExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        loadRecentExpenses(firebaseUser.uid);
      } else {
        setUser(null);
        console.error("No user is logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  const loadRecentExpenses = async (uid) => {
    try {
      const response = await axios.get(`http://localhost:5000/recentexpenses/${uid}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching recent expenses:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Latest Expenses</h1>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index} className="border p-2 mb-2 rounded-lg">
            <p>{expense.description}</p>
            <p>${expense.amount}</p>
            <p>{new Date(expense.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestExpenses;
