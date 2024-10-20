import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Import the CSS for SignIn component

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('User signed in with Google:', user);
      navigate('/dashboard'); // Navigate to the dashboard after successful sign-in
    } catch (error) {
      console.error('Error during Google Sign-In:', error.message);
      setError('Error during Google sign-in. Please try again.'); // Set error message
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed in with email:', user);
      navigate('/dashboard'); // Navigate to the dashboard after successful sign-in
    } catch (error) {
      console.error('Error during Email Sign-In:', error.message);
      // Check for specific error codes
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.'); // Set specific error message
      } else if (error.code === 'auth/user-not-found') {
        setError('No user found with this email. Please sign up.'); // Set specific error message
      } else {
        setError('Error during email sign-in. Please try again.'); // Generic error message
      }
    }
  };

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error message if it exists */}
      <form onSubmit={handleEmailSignIn} className="signin-form">
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
        <button type="submit" className="signin-button">Sign In with Email</button>
      </form>
      <button onClick={handleGoogleSignIn} className="google-button">Continue with Google</button>
    </div>
  );
};

export default SignIn;
