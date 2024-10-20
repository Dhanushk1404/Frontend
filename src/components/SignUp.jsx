import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  // Function to send user details to the backend
  const saveUserDetailsToMongoDB = async (userDetails) => {
    try {
      const response = await fetch('http://localhost:5000/saveUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails),
      });
      console.log(userDetails);

      const data = await response.json();
      if (response.ok) {
        console.log('User details saved to MongoDB:', data);
      } else {
        console.error('Failed to save user details:', data.message);
      }
    } catch (error) {
      console.error('Error saving user details:', error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Prepare user details
      const userDetails = {
        firebaseUID: user.uid,
        email: user.email,
        name: user.displayName,
        password: '', // No password for Google signup
      };

      // Save user to MongoDB
      await saveUserDetailsToMongoDB(userDetails);

      console.log('User signed up with Google:', user);
      navigate('/dashboard'); // Navigate to the dashboard after successful sign-up
    } catch (error) {
      console.error('Error during Google Sign-Up:', error.message);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user details
      const userDetails = {
        firebaseUID: user.uid,
        email: user.email,
        name: '', // No name available for email signup unless added to the form
        password: password, // Save the password as it's an email signup
      };

      // Save user to MongoDB
      await saveUserDetailsToMongoDB(userDetails);

      console.log('User signed up with email:', user);
      navigate('/dashboard'); // Navigate to the dashboard after successful sign-up
    } catch (error) {
      console.error('Error during Email Sign-Up:', error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://media.istockphoto.com/id/1424757003/photo/budget-and-financial-planning-concept-including-a-management-or-executive-cfo-estimating-the.jpg?s=612x612&w=0&k=20&c=-qReHcxce_QnKsWlvV1x7jOndAAjPpiuFR7fZ7AUfQ0=')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      <div className="flex w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden"> {/* Adjusted max-w-md */}
        <div className="flex flex-col w-full p-8">
          <h1 className="text-2xl font-bold mb-5">Create an Account</h1>
          <form onSubmit={handleEmailSignUp} className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-4 p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mb-4 p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full p-4 mb-4 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Sign Up with Email
            </button>
          </form>
          <button
            onClick={handleGoogleSignUp}
            className="w-full p-4 bg-red-500 text-white rounded-lg text-lg font-semibold hover:bg-red-600 transition duration-300"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
