import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Database, LogOut, Package, ClipboardList,
    Users, MapPin, Activity, PlusCircle, Trash2, 
    CheckCircle, XCircle, Droplet, AlertTriangle, History
} from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ stock: [], pending: 0 });
    const [alert, setAlert] = useState(null); 
    
    // Form States (Optional: for future add-modals)
    const [newCenter, setNewCenter] = useState({ center_name: '', location: '' });
    const [newDonation, setNewDonation] = useState({ donor_id: '', center_id: '', component_type: 'Whole Blood' });

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/${activeTab}`);
            setData(res.data);
        } catch (err) {
            console.error("Fetch failed:", err);
            setData([]); 
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error("Stats fetch failed:", err);
        }
    };

    useEffect(() => {
        fetchData();
        fetchStats();
    }, [activeTab]);

    const showAlert = (message, type = 'error') => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 5000);
    };

    // --- OPERATIONS HANDLERS ---

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/admin/requests/${id}`, { status: newStatus });
            showAlert(res.data.message, 'success');
            fetchData();
            fetchStats();
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Error updating status";
            showAlert(errorMsg, 'warning');
        }
    };

    const handleDeleteDonor = async (id) => {
        if (window.confirm("This action is permanent. Remove donor record?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/donors/${id}`);
                showAlert("Donor removed from database", 'success');
                fetchData();
            } catch (err) { 
                showAlert("Cannot delete: Donor has active history", 'error'); 
            }
        }
    };

    const handleCompleteDonation = async (id) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/admin/donations/${id}/complete`, { 
                component_type: 'Whole Blood' 
            });
            showAlert(res.data.message, 'success');
            fetchData();
            fetchStats();
        } catch (err) {
            showAlert(err.response?.data?.error || "Error completing donation", 'error');
        }
    };

    const handleRemoveDonation = async (id) => {
        if (window.confirm("Cancel this scheduled donation?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/donations/${id}`);
                showAlert("Donation removed", 'success');
                fetchData();
            } catch (err) {
                showAlert("Error removing donation", 'error');
            }
        }
    };

    return (
        <div style={styles.container}>
            {/* SIDEBAR */}
            <aside style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <div style={styles.logoIcon}><Droplet color="white" size={24} fill="white" /></div>
                    <h2 style={styles.sidebarTitle}>LifeFlow <span style={styles.proBadge}>PRO</span></h2>
                </div>

                <div style={styles.userSection}>
                    <div style={styles.avatar}>{user?.username?.[0].toUpperCase() || 'A'}</div>
                    <div style={styles.userMeta}>
                        <span style={styles.userName}>{user?.username || 'Admin'}</span>
                        <span style={styles.userRole}>System Control</span>
                    </div>
                </div>

                <nav style={styles.navMenu}>
                    <TabButton active={activeTab === 'inventory'} icon={<Package size={18} />} label="Live Inventory" onClick={() => setActiveTab('inventory')} />
                    <TabButton active={activeTab === 'requests'} icon={<ClipboardList size={18} />} label="Blood Requests" onClick={() => setActiveTab('requests')} />
                    <TabButton active={activeTab === 'donors'} icon={<Users size={18} />} label="Donor Registry" onClick={() => setActiveTab('donors')} />
                    <TabButton active={activeTab === 'donations'} icon={<Database size={18} />} label="Donation Logs" onClick={() => setActiveTab('donations')} />
                    <TabButton active={activeTab === 'centers'} icon={<MapPin size={18} />} label="Medical Centers" onClick={() => setActiveTab('centers')} />
                    <TabButton active={activeTab === 'audit'} icon={<History size={18} />} label="Audit Logs" onClick={() => setActiveTab('audit')} />
                </nav>

                <button onClick={onLogout} style={styles.logoutBtn}>
                    <LogOut size={18} /> <span>Security Sign Out</span>
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main style={styles.mainContent}>
                {alert && (
                    <div style={{...styles.alertBanner, backgroundColor: alert.type === 'success' ? '#ecfdf5' : '#fff1f2', borderLeft: `5px solid ${alert.type === 'success' ? '#10b981' : '#f43f5e'}`}}>
                        {alert.type === 'success' ? <CheckCircle size={20} color="#10b981"/> : <AlertTriangle size={20} color="#f43f5e"/>}
                        <span style={{color: alert.type === 'success' ? '#065f46' : '#9f1239'}}>{alert.message}</span>
                    </div>
                )}

                {/* STATS WIDGETS */}
                <div style={styles.analyticsRow}>
                    <div style={{ ...styles.statCard, borderBottom: '4px solid #f43f5e' }}>
                        <span style={styles.statLabel}>Priority Requests</span>
                        <div style={styles.statValue}>{stats.pending}</div>
                    </div>
                    {['A+', 'B+', 'O+', 'AB+'].map(group => {
                        const count = stats.stock?.find(s => s.blood_group === group)?.count || 0;
                        return (
                            <div key={group} style={styles.statCard}>
                                <div style={styles.statHeader}>
                                    <span style={styles.statLabel}>{group} Stock</span>
                                    <Droplet size={14} color={count > 0 ? '#f43f5e' : '#cbd5e1'} fill={count > 0 ? '#f43f5e' : 'none'}/>
                                </div>
                                <div style={{ ...styles.statValue, color: count > 0 ? '#1e293b' : '#94a3b8' }}>{count} <small style={{fontSize: '12px'}}>Units</small></div>
                            </div>
                        );
                    })}
                </div>

                <header style={styles.contentHeader}>
                    <div>
                        <h1 style={styles.pageTitle}>{activeTab.replace('_', ' ').toUpperCase()}</h1>
                        <p style={styles.pageSubtitle}>System authenticated: Managing global blood bank records.</p>
                    </div>
                </header>

                {/* DATA TABLE */}
                <div style={styles.card}>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {data.length > 0 ? Object.keys(data[0]).map(key => (
                                        <th key={key} style={styles.th}>{key.replace('_', ' ')}</th>
                                    )) : <th style={styles.th}>No Headers</th>}
                                    <th style={styles.th}>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? data.map((row, i) => (
                                    <tr key={i} style={styles.tr}>
                                        {Object.entries(row).map(([key, val], j) => (
                                            <td key={j} style={styles.td}>{renderCell(val, key)}</td>
                                        ))}
                                        <td style={styles.td}>
                                            <div style={styles.actionCell}>
                                                
                                                {/* 1. DONOR ACTIONS */}
                                                {activeTab === 'donors' && (
                                                    <button onClick={() => handleDeleteDonor(row.donor_id)} style={styles.iconBtnDanger} title="Purge Record">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}

                                                {/* 2. REQUEST ACTIONS */}
                                                {activeTab === 'requests' && row.status === 'Pending' && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(row.request_id, 'Fulfilled')} style={styles.iconBtnSuccess} title="FIFO Fulfillment">
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button onClick={() => handleUpdateStatus(row.request_id, 'Cancelled')} style={styles.iconBtnDanger} title="Reject Request">
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}

                                                {/* 3. DONATION LOG ACTIONS (New Implementation) */}
                                                {activeTab === 'donations' && row.status === 'Scheduled' && (
                                                    <>
                                                        <button onClick={() => handleCompleteDonation(row.donation_id)} style={styles.iconBtnSuccess} title="Complete & Add to Inventory">
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button onClick={() => handleRemoveDonation(row.donation_id)} style={styles.iconBtnDanger} title="Cancel Donation">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}

                                                {/* Status labels for processed rows */}
                                                {((activeTab === 'requests' || activeTab === 'donations') && row.status !== 'Pending' && row.status !== 'Scheduled') && (
                                                    <span style={styles.readOnlyText}>Processed</span>
                                                )}
                                                
                                                {(activeTab === 'inventory' || activeTab === 'audit' || activeTab === 'centers') && (
                                                    <span style={styles.readOnlyText}>Verified</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="10" style={styles.emptyState}>Secure database empty for {activeTab}.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

// HELPER COMPONENTS & FUNCTIONS

const TabButton = ({ active, icon, label, onClick }) => (
    <button style={active ? styles.activeTab : styles.tab} onClick={onClick}>
        {icon} <span>{label}</span>
    </button>
);

const renderCell = (val, key) => {
    if (val === 'Pending' || val === 'Available' || val === 'Scheduled') 
        return <span style={val === 'Fulfilled' ? styles.badgePrimary : styles.badgeWarning}>{val}</span>;
    if (val === 'Fulfilled' || val === 'Completed') return <span style={styles.badgeSuccess}>{val}</span>;
    if (val === 'Cancelled' || val === 'Expired' || val === 'Issued') return <span style={styles.badgeDanger}>{val}</span>;
    if (key.includes('date')) return <span style={{fontSize: '13px', color: '#64748b'}}>{new Date(val).toLocaleDateString()}</span>;
    if (key === 'blood_group') return <strong style={styles.bloodGroupText}>{val}</strong>;
    return val?.toString();
};

const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" },
    sidebar: { width: '280px', backgroundColor: '#0f172a', color: 'white', padding: '32px 24px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 10px rgba(0,0,0,0.05)' },
    sidebarHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' },
    logoIcon: { backgroundColor: '#f43f5e', padding: '8px', borderRadius: '12px' },
    sidebarTitle: { fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' },
    proBadge: { fontSize: '10px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle' },
    userSection: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.05)' },
    avatar: { width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' },
    userMeta: { display: 'flex', flexDirection: 'column' },
    userName: { fontSize: '15px', fontWeight: '600' },
    userRole: { fontSize: '12px', color: '#94a3b8' },
    navMenu: { display: 'flex', flexDirection: 'column', gap: '8px' },
    tab: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '12px', fontSize: '14px', fontWeight: '500', transition: '0.3s' },
    activeTab: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f43f5e', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '12px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)' },
    logoutBtn: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
    mainContent: { flex: 1, padding: '40px 50px', overflowY: 'auto' },
    alertBanner: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', fontWeight: '500' },
    analyticsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', marginBottom: '48px' },
    statCard: { backgroundColor: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' },
    statHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    statLabel: { fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statValue: { fontSize: '28px', fontWeight: '800', color: '#0f172a' },
    contentHeader: { marginBottom: '32px' },
    pageTitle: { fontSize: '32px', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px' },
    pageSubtitle: { color: '#64748b', fontSize: '15px', marginTop: '4px' },
    card: { backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', overflow: 'hidden', width: '100%' },
    tableWrapper: { overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' },
    table: { width: '100%', borderCollapse: 'collapse', minWidth: '800px' },
    th: { backgroundColor: '#f8fafc', padding: '20px', textAlign: 'left', fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', borderBottom: '2px solid #f1f5f9' },
    td: { padding: '20px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f8fafc' },
    tr: { transition: '0.2s', '&:hover': { backgroundColor: '#fdfdfd' } },
    badgeWarning: { padding: '6px 12px', backgroundColor: '#fff7ed', color: '#c2410c', borderRadius: '8px', fontSize: '12px', fontWeight: '700' },
    badgeSuccess: { padding: '6px 12px', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '8px', fontSize: '12px', fontWeight: '700' },
    badgePrimary: { padding: '6px 12px', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '8px', fontSize: '12px', fontWeight: '700' },
    badgeDanger: { padding: '6px 12px', backgroundColor: '#fff1f2', color: '#be123c', borderRadius: '8px', fontSize: '12px', fontWeight: '700' },
    bloodGroupText: { color: '#f43f5e', fontSize: '15px' },
    actionCell: { display: 'flex', gap: '10px' },
    iconBtnSuccess: { background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', cursor: 'pointer', padding: '8px', borderRadius: '10px' },
    iconBtnDanger: { background: '#fff1f2', border: '1px solid #ffe4e6', color: '#be123c', cursor: 'pointer', padding: '8px', borderRadius: '10px' },
    readOnlyText: { color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' },
    emptyState: { textAlign: 'center', padding: '60px', color: '#94a3b8', fontWeight: '500' }
};

export default Dashboard;