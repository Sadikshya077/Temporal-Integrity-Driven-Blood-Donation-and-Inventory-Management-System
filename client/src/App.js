import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Droplet, Users, LogOut, LayoutDashboard, PlusCircle, Search } from 'lucide-react';

// Import your page components
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RegisterDonor from './pages/RegisterDonor';
import LiveInventory from './pages/LiveInventory';
import Centers from './pages/Centers';
import RequestBlood from './pages/RequestBlood';

const App = () => {
  // 1. STATE VARIABLES
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); 
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [donors, setDonors] = useState([]);

  // 2. LOGIN LOGIC
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: loginData.username,
        password: loginData.password
      });

      setUser(response.data); 
      setView('dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed. Check Connection.");
    }
  };

  // 3. FETCH DATA (Only for Staff Dashboard)
  useEffect(() => {
    if (user && view === 'dashboard') {
      axios.get('http://localhost:5000/api/admin/donors')
        .then(res => setDonors(res.data))
        .catch(err => console.error(err));
    }
  }, [user, view]);

    const handleLogout = () => {
      setUser(null);
      setView('home');
    };

  // 4. NAVIGATION RENDERING LOGIC
  
  // Public Landing Page
  if (view === 'home') {
    return <Home onNavigate={setView} />;
  }

  
  // Public Centers View
  if (view === 'centers') {
    // Standardized to onNavigate
    return <Centers onNavigate={() => setView('home')} />;
  }

  // Public Live Inventory View
  if (view === 'inventory') {
    // Standardized to onNavigate
    return <LiveInventory onNavigate={() => setView('home')} />;
  }

  // Public Donor Registration View
  if (view === 'register') {
    // Fixed: Changed from setView('') to setV
    // iew('home') and standardized prop name
    return <RegisterDonor onNavigate={() => setView('home')} />;
  }

    if (view === 'requests') {
    return <RequestBlood onNavigate={() => setView('home')} />;
  }
//Staff View Login
if (view === 'login') {
    return (
      <div style={styles.loginOverlay}>
        <form style={styles.loginCard} onSubmit={handleLogin}>
          <button type="button" onClick={() => setView('home')} style={styles.backBtn}>← Home</button>
          <Droplet color="#ef4444" size={48} fill="#ef4444" style={{ marginBottom: 10 }} />
          <h1>Staff Portal</h1>
          <input 
            type="text" 
            placeholder="Username" 
            style={styles.loginInput} 
            onChange={(e) => setLoginData({...loginData, username: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={styles.loginInput} 
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
          />
          <button type="submit" style={styles.loginBtn}>Sign In</button>
        </form>
      </div>
    );
  }

  // Staff Internal Dashboard
if (view === 'dashboard' && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return <Home onNavigate={setView} />;
};



const styles = {
  loginOverlay: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' },
  loginCard: { position: 'relative', backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', textAlign: 'center', width: '350px' },
  backBtn: { position: 'absolute', top: '15px', left: '15px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' },
  loginInput: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
  loginBtn: { width: '100%', padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  dashboardLayout: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc' },
  sidebar: { width: '260px', backgroundColor: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '24px' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' },
  logoText: { fontSize: '22px', fontWeight: '800', color: '#0f172a' },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', marginBottom: '4px' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', marginTop: 'auto' },
  header: { height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' },
  primaryBtn: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  tableCard: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' },
  bloodBadge: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
};

export default App;