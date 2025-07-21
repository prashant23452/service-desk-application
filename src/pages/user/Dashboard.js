// src/pages/user/Dashboard.js
import React from 'react';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isAdmin={false} />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64 bg-blue-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Total Tickets Raised</h2>
            <p className="text-4xl mt-2">5</p>
          </div>

          <div className="bg-blue-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Tickets In Progress</h2>
            <p className="text-4xl mt-2">2</p>
          </div>

          <div className="bg-blue-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Resolved Tickets</h2>
            <p className="text-4xl mt-2">3</p>
          </div>
        </div>

        <div className="mt-8">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow">
            Raise New Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
