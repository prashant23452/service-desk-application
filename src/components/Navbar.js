import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, onSnapshot, query, where } from 'firebase/firestore';

// Notification context
const NotificationContext = createContext();
export function useNotifications() {
  return useContext(NotificationContext);
}

function useUserRole(user) {
  const [role, setRole] = useState(null);
  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }
    const fetchRole = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setRole(userSnap.data().role);
      } else {
        setRole(null);
      }
    };
    fetchRole();
  }, [user]);
  return role;
}

function NotificationProvider({ user, children }) {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (!user) return;
    let unsub = () => {};
    // Listen to tickets/comments for this user
    const ticketsRef = collection(db, 'tickets');
    const q = query(ticketsRef, where('createdBy', '==', user.uid));
    unsub = onSnapshot(q, (snapshot) => {
      const notifs = [];
      snapshot.forEach(docSnap => {
        const ticket = docSnap.data();
        // Add status change notification
        if (ticket.status && ticket.status !== 'Open') {
          notifs.push({
            id: docSnap.id + '-status',
            type: 'status',
            ticketId: docSnap.id,
            status: ticket.status,
            subject: ticket.subject,
            time: ticket.updatedAt || ticket.createdAt,
          });
        }
      });
      setNotifications(notifs);
    });
    return () => unsub();
  }, [user]);
  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export default function Navbar() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const role = useUserRole(user);
  const { notifications = [] } = useNotifications() || {};

  // Links for non-admin screens
  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
  ];

  // Links for admin screens
  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
  ];

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <NotificationProvider user={user}>
      <nav className='bg-white shadow-md sticky top-0 z-50 border-b border-slate-200'>
        <div className='container px-4 py-4 flex mx-auto items-center justify-between'>
          <Link to='/' className='text-2xl font-bold text-indigo-600'>
            ServiceDesk
          </Link>
          {!isAuthPage && (
            <>
              <div className='hidden md:flex gap-6 items-center'>
                {user && role === 'admin' ? (
                  <>
                    {adminLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`text-slate-700 hover:text-indigo-600 transition px-2 py-1 rounded ${location.pathname === link.to ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className='bg-rose-500 hover:bg-rose-600 text-white px-4 py-1 rounded transition font-semibold text-sm'
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`text-slate-700 hover:text-indigo-600 transition px-2 py-1 rounded ${location.pathname === link.to ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    {!user ? (
                      <Link
                        to='/login'
                        className={`text-slate-700 hover:text-indigo-600 transition px-2 py-1 rounded ${location.pathname === '/login' ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}
                      >
                        Login
                      </Link>
                    ) : (
                      <>
                        <span className='text-slate-500 text-sm mr-2'>{user.email}</span>
                        <button
                          onClick={handleLogout}
                          className='bg-rose-500 hover:bg-rose-600 text-white px-4 py-1 rounded transition font-semibold text-sm'
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </>
                )}
                {user && notifications.length > 0 && (
                  <div className='relative'>
                    <button className='relative focus:outline-none'>
                      <span className='material-icons text-indigo-600'>notifications</span>
                      <span className='absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full px-2'>{notifications.length}</span>
                    </button>
                  </div>
                )}
              </div>
              <button
                className='md:hidden text-slate-700 focus:outline-none ml-4'
                onClick={() => setMenuOpen((open) => !open)}
                aria-label='Toggle menu'
              >
                <svg className='w-7 h-7' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
              {menuOpen && (
                <div className='absolute top-16 right-4 bg-white border border-slate-200 rounded shadow-lg flex flex-col gap-2 p-4 md:hidden'>
                  {user && role === 'admin' ? (
                    <>
                      {adminLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={`text-slate-700 hover:text-indigo-600 transition px-2 py-1 rounded ${location.pathname === link.to ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => { setMenuOpen(false); handleLogout(); }}
                        className='bg-rose-500 hover:bg-rose-600 text-white px-4 py-1 rounded transition font-semibold text-sm mt-2'
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {navLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={`text-slate-700 hover:text-indigo-600 transition px-2 py-1 rounded ${location.pathname === link.to ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                      {!user ? (
                        <Link
                          to='/login'
                          className={`text-slate-700 hover:text-indigo-600 transition px-2 py-1 rounded ${location.pathname === '/login' ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          Login
                        </Link>
                      ) : (
                        <button
                          onClick={() => { setMenuOpen(false); handleLogout(); }}
                          className='bg-rose-500 hover:bg-rose-600 text-white px-4 py-1 rounded transition font-semibold text-sm mt-2'
                        >
                          Logout
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </NotificationProvider>
  );
}
