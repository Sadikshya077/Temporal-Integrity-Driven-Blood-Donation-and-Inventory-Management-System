import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Droplet, ArrowLeft, Activity, Calendar, ShieldCheck } from 'lucide-react';

const LiveInventory = ({ onNavigate }) => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/inventory');
                setInventory(res.data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    return (
        <div style={styles.pageBackground}>
            <div style={styles.contentWrapper}>
                {/* STYLISH BACK BUTTON */}
                <div style={styles.backBtnWrapper}>
                    <button 
                        onClick={onNavigate} 
                        style={styles.backBtn}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                    >
                        <div style={styles.backIconCircle}>
                            <ArrowLeft size={16} />
                        </div>
                        <span style={styles.backText}>Return to Home</span>
                    </button>
                </div>

                {/* HEADER SECTION */}
                <header style={styles.header}>
                    <div style={styles.pulseIcon}>
                        <Activity size={32} color="#ef4444" />
                    </div>
                    <h1 style={styles.title}>Live Inventory</h1>
                    <p style={styles.subtitle}>Real-time availability of verified blood components across all centers.</p>
                </header>

                {/* INVENTORY GRID */}
                <div style={styles.grid}>
                    {loading ? (
                        <p style={styles.statusMsg}>Synchronizing with medical database...</p>
                    ) : inventory.length > 0 ? (
                        inventory.map((item) => (
                            <div key={item.inventory_id} style={styles.card}>
                                <div style={styles.cardTop}>
                                    <div style={styles.bloodBadge}>
                                        {/* Assuming item has a blood_group field, otherwise fallback to Droplet */}
                                        {item.blood_group || <Droplet size={20} fill="#ef4444" />}
                                    </div>
                                    <div style={styles.statusBadge}>
                                        <div style={styles.liveDot}></div>
                                        {item.status}
                                    </div>
                                </div>

                                <div style={styles.cardContent}>
                                    <h3 style={styles.componentName}>{item.component_type}</h3>
                                    <div style={styles.metaRow}>
                                        <Calendar size={14} />
                                        <span>Expires: {new Date(item.expiry_date).toLocaleDateString()}</span>
                                    </div>
                                    <div style={styles.metaRow}>
                                        <ShieldCheck size={14} color="#10b981" />
                                        <span style={{color: '#10b981', fontWeight: '600'}}>Safety Verified</span>
                                    </div>
                                </div>
                                
                                <div style={styles.cardFooter}>
                                    Unit ID: #{item.inventory_id.toString().padStart(4, '0')}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={styles.emptyState}>
                            <p>No units currently available in inventory.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageBackground: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Inter', sans-serif" },
    contentWrapper: { maxWidth: '1200px', margin: '0 auto' },
    
    // BACK BUTTON
    backBtnWrapper: { alignSelf: 'flex-start', marginBottom: '30px' },
    backBtn: {
        display: 'flex', alignItems: 'center', gap: '12px', border: 'none', background: 'none',
        cursor: 'pointer', color: '#64748b', transition: 'all 0.2s ease',
    },
    backIconCircle: {
        width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0'
    },
    backText: { fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' },

    // HEADER
    header: { textAlign: 'center', marginBottom: '50px' },
    pulseIcon: { backgroundColor: '#fee2e2', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' },
    title: { fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0' },
    subtitle: { fontSize: '16px', color: '#64748b', maxWidth: '600px', margin: '0 auto' },

    // GRID & CARDS
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
    card: { 
        backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', 
        overflow: 'hidden', transition: 'transform 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
    },
    cardTop: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' },
    bloodBadge: { 
        width: '45px', height: '45px', backgroundColor: '#ef4444', color: 'white', 
        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '800', fontSize: '18px', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)'
    },
    statusBadge: { 
        display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', 
        padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: '#475569' 
    },
    liveDot: { width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' },

    cardContent: { padding: '20px' },
    componentName: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 15px 0' },
    metaRow: { display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '13px', marginBottom: '8px' },
    
    cardFooter: { backgroundColor: '#f8fafc', padding: '12px 20px', fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.5px' },

    statusMsg: { textAlign: 'center', width: '100%', color: '#64748b', gridColumn: '1/-1', marginTop: '40px' },
    emptyState: { gridColumn: '1/-1', textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '20px', color: '#64748b' }
};

export default LiveInventory;