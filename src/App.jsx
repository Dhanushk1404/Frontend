import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import Dashboard from './components/dashboard.jsx';
import Home from './components/Home.jsx';
import Budgets from './components/Budget.jsx';
import LatestExpenses from './components/Expenses.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path="/budgets" element={<PrivateRoute><Budgets/></PrivateRoute>}/>
        <Route path="/expenses" element={<PrivateRoute><LatestExpenses/></PrivateRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;
