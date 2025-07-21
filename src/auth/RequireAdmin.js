// src/auth/RequireAdmin.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../components/Loading'; // optional loader

const RequireAdmin = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === 'admin') {
          // Admin verified
        } else {
          alert('Access denied: Admins only.');
          navigate('/');
        }
      } else {
        navigate('/login');
      }
    };

    if (!loading) {
      checkAdmin();
    }
  }, [user, loading, navigate]);

  if (loading) return <Loading />;

  return children;
};

export default RequireAdmin;
