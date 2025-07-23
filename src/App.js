import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RequireAuth from "./auth/RequireAuth";
import RequireAdmin from "./auth/RequireAdmin";
import TicketForm from "./components/TicketForm";
import AllTickets from "./pages/admin/AllTicket";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import MyTicket from "./pages/user/MyTicket";
import AdminTicketDetail from "./pages/admin/AdminTicketDetail";
import Profile from "./pages/user/Profile";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [user] = useAuthState(auth);
  const [role, setRole] = useState(null);
  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }
    const fetchRole = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) setRole(userSnap.data().role);
      else setRole(null);
    };
    fetchRole();
  }, [user]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected User Route */}
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Only allow /raise-ticket if user is not admin */}
              {user && role !== "admin" && (
                <Route path="/raise-ticket" element={<TicketForm />} />
              )}
              {user && role !== "admin" && (
                <Route path="/my-tickets" element={<MyTicket />} />
              )}
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Protected Admin Route */}
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/all-tickets" element={<AllTickets />} />
              <Route path="/admin/ticket/:id" element={<AdminTicketDetail />} />
            </Route>

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="text-center text-red-400 text-xl font-semibold mt-20">
                  404 - Page Not Found
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
