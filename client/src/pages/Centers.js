import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, ArrowLeft, Building2, Navigation, Phone, Clock } from 'lucide-react';

const Centers = ({ onNavigate }) => {
    const [centers, setCenters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/centers');
                setCenters(res.data);
            } catch (err) {
                console.error("Error fetching centers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCenters();
    }, []);

    return (
        <div style={styles.pageBackground}>
            <div style={styles.contentWrapper}>
                
                {/* STYLISH BACK BUTTON */}
                <div style={styles.backBtnWrapper}>
                    <button 
                        onClick={() => onNavigate('home')} 
                        style={styles.backBtn}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(-5px)';
                            e.currentTarget.style.color = '#0f172a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.color = '#64748b';
                        }}
                    >
                        <div style={styles.backIconCircle}>
                            <ArrowLeft size={16} />
                        </div>
                        <span style={styles.backText}>Return to Home</span>
                    </button>
                </div>

                {/* HEADER SECTION */}
                <header style={styles.header}>
                    <div style={styles.iconContainer}>
                        <div style={styles.mainIconCircle}>
                            <Building2 size={32} color="white" />
                        </div>
                    </div>
                    <h1 style={styles.title}>Donation Centers</h1>
                    <p style={styles.subtitle}>Find a certified LifeFlow collection point near your location for safe donations.</p>
                </header>

                {/* CONTENT SECTION */}
                {loading ? (
                    <div style={styles.loaderContainer}>
                        <div style={styles.loader}></div>
                        <p style={{color: '#64748b', fontWeight: '600', marginTop: '15px'}}>Mapping locations...</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {centers.length > 0 ? centers.map((center) => (
                            <div key={center.center_id} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.mapPinBg}>
                                        <MapPin color="#ef4444" size={20} fill="#fee2e2" />
                                    </div>
                                    <span style={styles.idBadge}>CENTER ID: {center.center_id}</span>
                                </div>
                                
                                <div style={styles.cardBody}>
                                    <h3 style={styles.centerName}>{center.center_name}</h3>
                                    <div style={styles.locationRow}>
                                        <Navigation size={14} color="#ef4444" />
                                        <p style={styles.locationText}>{center.location}</p>
                                    </div>
                                    
                                    <div style={styles.infoRow}>
                                        <Clock size={14} color="#94a3b8" />
                                        <span style={styles.infoText}>Open: 9:00 AM - 5:00 PM</span>
                                    </div>
                                </div>

                                <button 
                                    style={styles.directionBtn}
                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.center_name + ' ' + center.location)}`, '_blank')}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                >
                                    Get Directions
                                </button>
                            </div>
                        )) : (
                            <div style={styles.emptyState}>
                                <p>No active centers found in the registry.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    pageBackground: {
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
        padding: '40px 20px',
        backgroundImage: 'radial-gradient(#e2e8f0 0.5px, transparent 0.5px)',
        backgroundSize: '24px 24px'
    },
    contentWrapper: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column'
    },
    backBtnWrapper: { alignSelf: 'flex-start', marginBottom: '40px' },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#64748b',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    backIconCircle: {
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
    },
    backText: { fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' },

    header: { textAlign: 'center', marginBottom: '60px' },
    mainIconCircle: { 
        backgroundColor: '#ef4444', 
        width: '64px', 
        height: '64px', 
        borderRadius: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '0 auto 20px',
        boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
    },
    title: { fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px 0', letterSpacing: '-1px' },
    subtitle: { fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' },

    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
        gap: '30px' 
    },
    card: { 
        backgroundColor: 'white', 
        padding: '28px', 
        borderRadius: '24px', 
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' },
    mapPinBg: { backgroundColor: '#fee2e2', padding: '12px', borderRadius: '14px' },
    idBadge: { backgroundColor: '#f8fafc', color: '#94a3b8', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.5px' },
    
    cardBody: { flex: 1, marginBottom: '25px' },
    centerName: { fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0' },
    locationRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
    locationText: { color: '#475569', fontSize: '15px', margin: 0, fontWeight: '500' },
    infoRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    infoText: { color: '#94a3b8', fontSize: '13px', fontWeight: '500' },
    
    directionBtn: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        color: '#0f172a',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    },

    loaderContainer: { textAlign: 'center', marginTop: '100px' },
    loader: {
        width: '48px',
        height: '48px',
        border: '5px solid #e2e8f0',
        borderTop: '5px solid #ef4444',
        borderRadius: '50%',
        margin: '0 auto',
        animation: 'spin 1s linear infinite',
    },
    emptyState: { gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: '#94a3b8' }
};

export default Centers;