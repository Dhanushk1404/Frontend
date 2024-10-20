import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Optional: Create a CSS file for styling

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
    <div className="signup-container">
      <h1>Create an Account</h1>
      <form onSubmit={handleEmailSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up with Email</button>
      </form>
      <button onClick={handleGoogleSignUp}>Continue with Google</button>
    </div>
  );
};

export default SignUp;
