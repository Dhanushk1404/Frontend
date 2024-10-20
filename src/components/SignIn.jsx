import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('User signed in with Google:', user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during Google Sign-In:', error.message);
      setError('Error during Google sign-in. Please try again.');
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed in with email:', user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during Email Sign-In:', error.message);
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No user found with this email. Please sign up.');
      } else {
        setError('Error during email sign-in. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src="https://moneyview.in/images/blog/wp-content/uploads/2017/10/Blog-11-reasonsfeature-min.jpg" 
          alt="img" 
          className="hidden md:block w-1/2 h-auto" 
        />
        <div className="flex flex-col w-1/2 p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800">Sign In</h1>
          <p className="text-center text-gray-600 mb-4">Welcome back! Please log in to continue.</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleEmailSignIn} className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-4 border border-gray-300 rounded-lg text-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa fa-eye${showPassword ? '-slash' : ''}`} aria-hidden="true"></i>
              </span>
            </div>
            <button
              type="submit"
              className="w-full p-4 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Sign In with Email
            </button>
          </form>
          <button
            onClick={handleGoogleSignIn}
            className="w-full p-4 mt-4 bg-red-500 text-white rounded-lg text-lg font-semibold hover:bg-red-600 transition duration-300"
          >
            Continue with Google
          </button>
          <div className="flex flex-col items-center mt-4">
            <p className="text-center">Are you a new user? 
              <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/signup')}> Sign Up here</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
