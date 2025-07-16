import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RequireAuth from './auth/RequireAuth';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-[oklch(0.34_0.07_200.84)] text-white'>
        <Navbar/>
        <div className='container mx-auto px-4 py-6'>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route element={<RequireAuth/>}>
              <Route path="/dashboard" element={<Dashboard/>}/>
            </Route>
            <Route element={<RequireAuth/>}>
              <Route path="/admin" element={<AdminDashboard/>}/>
            </Route>
            
          </Routes>
          
        </div>
      </div>
    
    </Router>
  );
}

export default App;
