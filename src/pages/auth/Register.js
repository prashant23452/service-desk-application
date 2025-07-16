import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const [googleRolePrompt, setGoogleRolePrompt] = useState(false);
  const [newGoogleUserUID, setNewGoogleUserUID] = useState(null);

  // 🔹 Email/Password Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role,
      });

      role === 'admin' ? navigate('/admin') : navigate('/dashboard');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  // 🔹 Google Registration with Role Selection
  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role;
        role === 'admin' ? navigate('/admin') : navigate('/dashboard');
      } else {
        // New Google user: ask for role
        setGoogleRolePrompt(true);
        setNewGoogleUserUID(user.uid);
      }
    } catch (error) {
      alert('Google sign-in failed: ' + error.message);
    }
  };

  // 🔹 Save Google Role After Selection
  const handleGoogleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newGoogleUserUID) return;

      await setDoc(doc(db, 'users', newGoogleUserUID), {
        role,
      });

      role === 'admin' ? navigate('/admin') : navigate('/dashboard');
    } catch (error) {
      alert('Failed to save role: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-6">Create an Account</h2>

        {!googleRolePrompt && (
          <>
            {/* Email Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold transition"
              >
                Register
              </button>
            </form>

            <div className="my-4 text-center text-sm text-gray-400">or</div>

            {/* Google Register Button */}
            <button
              onClick={handleGoogleRegister}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold transition"
            >
              Continue with Google
            </button>
          </>
        )}

        {/* Role Selection for Google Users */}
        {googleRolePrompt && (
          <form onSubmit={handleGoogleRoleSubmit} className="mt-6 space-y-4">
            <p className="text-gray-300 mb-2">Select your role for Google account:</p>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold transition"
            >
              Continue
            </button>
          </form>
        )}

        <p className="text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-400 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
