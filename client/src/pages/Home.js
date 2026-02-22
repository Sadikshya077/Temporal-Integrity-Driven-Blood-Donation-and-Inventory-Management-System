import React from 'react';
import {
    Droplet, Activity, Heart, ShieldCheck,
    MapPin, ArrowRight, Lock
} from 'lucide-react';

const Home = ({ onNavigate }) => (
    <div className="modern-container" style={styles.pageWrapper}>
        {/* TOP NAVIGATION BAR - Professional Dark Theme */}
        <nav style={styles.navBar}>
            <div style={styles.navLogo}>
                <Droplet color="#ff4d4d" fill="#ff4d4d" size={26} />
                <span style={styles.logoText}>LifeFlow</span>
            </div>
            <div style={styles.navLinks}>
                <button onClick={() => onNavigate('centers')} style={styles.navBtnBold}>CENTERS</button>
                <button onClick={() => onNavigate('inventory')} style={styles.navBtnBold}>LIVE INVENTORY</button>
                
                <div style={styles.divider}></div>
                
                <button onClick={() => onNavigate('login')} style={styles.staffLoginBtn}>
                    <Lock size={14} /> STAFF PORTAL
                </button>
            </div>
        </nav>

        {/* HERO SECTION */}
        <section style={styles.hero}>
            <div style={styles.patternOverlay}></div>
            <div style={styles.heroContent}>
                <span style={styles.heroBadge}>Emergency Blood Coordination</span>
                <h1 style={styles.heroTitle}>
                    Giving Blood is <span style={{ color: '#ef4444' }}>Giving Life.</span>
                </h1>
                <p style={styles.heroSub}>
                    The most reliable platform connecting life-saving donors with those in urgent need. 
                    Simple, secure, and real-time.
                </p>
                <div style={styles.ctaGroup}>
                    <button onClick={() => onNavigate('register')} style={styles.primaryBtn}>
                        Become a Donor <Heart size={18} fill="white" />
                    </button>
                    <button onClick={() => onNavigate('requests')} style={styles.secondaryBtn}>
                        Request Blood <Droplet size={18} />
                    </button>
                </div>
            </div>
        </section>

        {/* QUICK INFO CARDS - Floating on Background */}
        <section style={styles.featureGrid}>
            <FeatureCard
                icon={<ShieldCheck color="#ef4444" size={28} />}
                title="Secure Registry"
                desc="Protected data used only for medical coordination and verified hospital requests."
            />
            <FeatureCard
                icon={<Activity color="#3b82f6" size={28} />}
                title="Live Inventory"
                desc="Real-time tracking of blood groups available across all partner facilities."
            />
            <FeatureCard
                icon={<MapPin color="#10b981" size={28} />}
                title="Nearby Centers"
                desc="Locate authorized blood collection centers and schedule your visit instantly."
            />
        </section>

        {/* CONTENT SECTION */}
        <section style={styles.contentSection}>
            <div style={styles.textColumn}>
                <span style={styles.sectionBadge}>Our Mission</span>
                <h2 style={styles.sectionTitle}>Why Join LifeFlow?</h2>
                <p style={styles.sectionPara}>Our automated system checks your eligibility based on medical standards, ensuring donor safety first while maximizing community impact.</p>
                <ul style={styles.list}>
                    <li style={styles.listItem}><ArrowRight size={16} color="#ef4444" /> Automated eligibility tracking</li>
                    <li style={styles.listItem}><ArrowRight size={16} color="#ef4444" /> Hospital request fulfillment</li>
                    <li style={styles.listItem}><ArrowRight size={16} color="#ef4444" /> 24/7 Emergency support</li>
                </ul>
            </div>
            <div style={styles.statsCardGrid}>
                <div style={styles.statItem}>
                    <h3 style={styles.statNumber}>10k+</h3>
                    <p style={styles.statLabel}>Active Donors</p>
                </div>
                <div style={styles.statItem}>
                    <h3 style={styles.statNumber}>50+</h3>
                    <p style={styles.statLabel}>Partner Centers</p>
                </div>
            </div>
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
            <div style={styles.footerContent}>
                <p>© 2026 LifeFlow Management System. All rights reserved.</p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button onClick={() => onNavigate('login')} style={styles.adminLink}>
                        Admin Access
                    </button>
                </div>
            </div>
        </footer>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div style={styles.card}>
        <div style={styles.iconCircle}>{icon}</div>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardDesc}>{desc}</p>
    </div>
);

const styles = {
    pageWrapper: { 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#f8fafc', 
        fontFamily: "'Inter', 'Segoe UI', sans-serif" 
    },
    // NAVBAR
    navBar: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 80px', 
        backgroundColor: '#0f172a', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    navLogo: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoText: { fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' },
    navLinks: { display: 'flex', gap: '10px', alignItems: 'center' },
    navBtnBold: { 
        background: 'none', 
        border: 'none', 
        color: '#ffffff', 
        fontWeight: '800', 
        cursor: 'pointer', 
        fontSize: '13px', 
        letterSpacing: '0.05em', 
        padding: '10px 15px',
        transition: 'opacity 0.2s'
    },
    divider: { width: '1px', height: '24px', backgroundColor: '#334155', margin: '0 10px' },
    staffLoginBtn: { 
        backgroundColor: '#334155', 
        color: 'white', 
        padding: '10px 20px', 
        borderRadius: '8px', 
        border: 'none', 
        cursor: 'pointer', 
        fontWeight: '700', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        fontSize: '12px',
        letterSpacing: '0.02em'
    },

    // HERO
    hero: { 
        padding: '120px 20px 160px', 
        textAlign: 'center', 
        position: 'relative', 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0'
    },
    heroBadge: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'inline-block' },
    patternOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 5c-3 5-7 10-7 14a7 7 0 0 0 14 0c0-4-4-9-7-14z' fill='%23ef4444'/%3E%3C/svg%3E")` },
    heroTitle: { fontSize: '56px', fontWeight: '900', marginBottom: '20px', color: '#0f172a', letterSpacing: '-1.5px' },
    heroSub: { fontSize: '20px', color: '#475569', maxWidth: '650px', margin: '0 auto 40px', lineHeight: '1.6' },
    
    ctaGroup: { display: 'flex', gap: '15px', justifyContent: 'center' },
    primaryBtn: { backgroundColor: '#ef4444', color: 'white', padding: '18px 38px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', boxShadow: '0 10px 20px -5px rgba(239, 68, 68, 0.4)' },
    secondaryBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '18px 38px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a', fontSize: '16px' },

    // FEATURES
    featureGrid: { display: 'flex', gap: '24px', padding: '0 80px', maxWidth: '1200px', margin: '-60px auto 0', position: 'relative', zIndex: 2 },
    card: { flex: 1, padding: '40px 30px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', border: '1px solid #f1f5f9' },
    iconCircle: { width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' },
    cardTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' },
    cardDesc: { color: '#64748b', fontSize: '15px', lineHeight: '1.6' },

    // CONTENT
    contentSection: { display: 'flex', padding: '100px 80px', alignItems: 'center', gap: '80px', maxWidth: '1200px', margin: '0 auto' },
    sectionBadge: { color: '#ef4444', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' },
    sectionTitle: { fontSize: '40px', fontWeight: '800', marginBottom: '24px', color: '#0f172a', letterSpacing: '-0.5px' },
    sectionPara: { fontSize: '18px', color: '#475569', marginBottom: '30px', lineHeight: '1.7' },
    textColumn: { flex: 1.4 },
    list: { listStyle: 'none', padding: 0 },
    listItem: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', color: '#334155', fontWeight: '600' },
    
    statsCardGrid: { flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    statItem: { backgroundColor: 'white', padding: '40px 20px', borderRadius: '24px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    statNumber: { fontSize: '36px', fontWeight: '900', color: '#ef4444', margin: '0 0 8px 0' },
    statLabel: { color: '#64748b', fontSize: '15px', fontWeight: '600', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' },

    footer: { marginTop: 'auto', padding: '40px 80px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' },
    footerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '14px' },
    adminLink: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }
};

export default Home;