
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Loading from '../components/Loading'; // Optional loading spinner

const RequireAuth = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <Loading />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
