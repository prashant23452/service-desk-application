import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <nav className='bg-gray-800 shadow-md'>
      <div className='container px-4 py-6 flex mx-auto item-center justify-between'>
        <Link to='/' className='text-xl font-bold text-white'>
          ServiceDesk
        </Link>
        {!isAuthPage && (
          <div className='flex gap-4'>
            <Link to='/' className='text-gray-300 hover:text-white transition'>Home</Link>
            <Link to='/dashboard' className='text-gray-300 hover:text-white transition'>Dashboard</Link>
            <Link to='/admin' className='text-gray-300 hover:text-white transition'>Admin</Link>
            <Link to='/login' className='text-gray-300 hover:text-white transition'>Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
