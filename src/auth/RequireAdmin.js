import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../components/Loading'; // optional loader

const RequireAdmin = () => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().role === 'admin') {
        setIsAdmin(true);
      } else {
        alert('Access denied: Admins only.');
        navigate('/');
      }
    };

    if (!loading) checkAdmin();
  }, [user, loading, navigate]);

  if (loading || isAdmin === null) return <Loading />;

  return <Outlet />;
};

export default RequireAdmin;
