import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-900 text-gray-100">
      
      <section className="text-center px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to ServiceDesk
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl mx-auto">
          Raise support tickets, track issues, and get help — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-200 text-gray-900 hover:bg-gray-300 font-semibold px-6 py-3 rounded transition"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Middle: Features Section */}
      <section className="bg-gray-800 py-16 px-4">
        <h2 className="text-3xl font-semibold text-center text-white mb-12">Features</h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-white mb-2">Raise Tickets</h3>
            <p className="text-gray-300">
              Submit detailed issue reports with priority and category to get quick support.
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
            <p className="text-gray-300">
              View real-time ticket status and communicate with support for updates.
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-white mb-2">Admin Dashboard</h3>
            <p className="text-gray-300">
              Admins can assign, manage, and resolve tickets efficiently from a single panel.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom: Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm py-6 px-4 text-center border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <p className="mb-2">&copy; {new Date().getFullYear()} ServiceDesk. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
