import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/admin', label: 'Admin' },
    { to: '/login', label: 'Login' },
  ];

  return (
    <nav className='bg-gray-800 shadow-md sticky top-0 z-50'>
      <div className='container px-4 py-4 flex mx-auto items-center justify-between'>
        <Link to='/' className='text-xl font-bold text-white'>
          ServiceDesk
        </Link>
        {!isAuthPage && (
          <>
            <div className='hidden md:flex gap-6'>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-gray-300 hover:text-white transition px-2 py-1 rounded ${location.pathname === link.to ? 'bg-gray-700 text-white font-semibold' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <button
              className='md:hidden text-gray-300 focus:outline-none ml-4'
              onClick={() => setMenuOpen((open) => !open)}
              aria-label='Toggle menu'
            >
              <svg className='w-7 h-7' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
            {menuOpen && (
              <div className='absolute top-16 right-4 bg-gray-800 rounded shadow-lg flex flex-col gap-2 p-4 md:hidden'>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-gray-300 hover:text-white transition px-2 py-1 rounded ${location.pathname === link.to ? 'bg-gray-700 text-white font-semibold' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
