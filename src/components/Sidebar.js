// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isAdmin }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/raise-ticket', label: 'Raise Ticket' },
    { to: '/my-tickets', label: 'My Tickets' },
    { to: '/profile', label: 'Profile' },
  ];
  const adminLinks = [
    { to: '/admin/all-tickets', label: 'All Tickets' },
    { to: '/admin/assign', label: 'Assign Tickets' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-950 text-white p-2 rounded focus:outline-none shadow-lg"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </button>
      {/* Sidebar */}
      <div className={`w-64 h-screen bg-blue-950 text-white fixed top-0 left-0 p-6 z-40 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block`}
        aria-label="Sidebar navigation"
      >
        <h2 className="text-xl font-bold mb-8">Service Desk</h2>
        <nav className="flex flex-col space-y-4">
          {userLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-blue-300 px-2 py-1 rounded ${location.pathname === link.to ? 'bg-blue-800 text-blue-200 font-semibold' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-blue-300 px-2 py-1 rounded ${location.pathname === link.to ? 'bg-blue-800 text-blue-200 font-semibold' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar overlay"></div>}
    </>
  );
};

export default Sidebar;
