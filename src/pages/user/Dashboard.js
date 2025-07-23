// src/pages/user/Dashboard.js
import React from 'react';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar isAdmin={false} />
      {/* Main Content */}
      <div className="flex-1 p-8 ml-64 min-h-screen text-slate-800">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700">Welcome to Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-700">Total Tickets Raised</h2>
            <p className="text-4xl mt-2 text-indigo-600 font-bold">5</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-700">Tickets In Progress</h2>
            <p className="text-4xl mt-2 text-emerald-500 font-bold">2</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-700">Resolved Tickets</h2>
            <p className="text-4xl mt-2 text-emerald-600 font-bold">3</p>
          </div>
        </div>
        <div className="mt-10">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg shadow font-semibold text-lg transition"
            onClick={() => navigate('/raise-ticket')}
          >
            Raise New Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
