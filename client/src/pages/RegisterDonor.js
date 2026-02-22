import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Calendar, User, Phone, Droplet, Heart, 
    ArrowLeft, Info, CheckCircle2, AlertCircle, MapPin 
} from 'lucide-react';

const RegisterDonor = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        blood_group: 'O+',
        contact: '',
        gender: 'Male',
        donation_type: 'Whole Blood',
        donation_date: new Date().toISOString().split('T')[0],
        center_id: '' 
    });

    const [centers, setCenters] = useState([]);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    // Fetch centers from database on load
    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/donors/centers');
                setCenters(res.data);
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, center_id: res.data[0].center_id }));
                }
            } catch (err) {
                console.error("Failed to load centers", err);
            }
        };
        fetchCenters();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await axios.post('http://localhost:5000/api/donors/register', formData);
            setStatus({ type: 'success', message: res.data.message });
            setTimeout(() => onNavigate('home'), 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Registration failed.";
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageBackground}>
            <div style={styles.contentWrapper}>
                
                {/* STYLISH BACK BUTTON */}
                <div style={styles.backBtnWrapper}>
                    <button 
                        onClick={() => onNavigate('home')} 
                        style={styles.backBtn}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(-4px)';
                            e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.color = '#64748b';
                        }}
                    >
                        <div style={styles.backIconCircle}>
                            <ArrowLeft size={18} strokeWidth={2.5} />
                        </div>
                        <span style={styles.backText}>Return to Home</span>
                    </button>
                </div>

                <div style={styles.formCard}>
                    <div style={styles.formHeader}>
                        <div style={styles.iconHeader}>
                            <Heart size={32} color="#ef4444" fill="#ef4444" />
                        </div>
                        <h2 style={styles.title}>Donor Registration</h2>
                        <p style={styles.subtitle}>Fill in details to register your donation.</p>
                    </div>

                    {status.message && (
                        <div style={{
                            ...styles.statusBanner, 
                            ...(status.type === 'success' ? styles.successBanner : styles.errorBanner)
                        }}>
                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}><User size={14} /> FULL NAME</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.full_name} 
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
                                style={styles.input} 
                            />
                        </div>

                        <div style={styles.row}>
                            <div style={{ flex: 1 }}>
                                <label style={styles.label}><Droplet size={14} /> BLOOD GROUP</label>
                                <select 
                                    style={styles.input} 
                                    value={formData.blood_group} 
                                    onChange={e => setFormData({ ...formData, blood_group: e.target.value })}
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={styles.label}>GENDER</label>
                                <select 
                                    style={styles.input} 
                                    value={formData.gender} 
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Phone size={14} /> CONTACT NUMBER</label>
                            <input 
                                type="tel" 
                                required 
                                value={formData.contact} 
                                onChange={e => setFormData({ ...formData, contact: e.target.value })} 
                                style={styles.input} 
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><MapPin size={14} /> SELECT BLOOD CENTER</label>
                            <select 
                                style={styles.input} 
                                value={formData.center_id} 
                                onChange={e => setFormData({ ...formData, center_id: e.target.value })}
                                required
                            >
                                {centers.length === 0 && <option>Loading centers...</option>}
                                {centers.map(c => (
                                    <option key={c.center_id} value={c.center_id}>
                                        {c.center_name} ({c.location})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Calendar size={14} /> PREFERRED DATE</label>
                            <input 
                                type="date" 
                                value={formData.donation_date} 
                                min={new Date().toISOString().split('T')[0]} 
                                onChange={e => setFormData({ ...formData, donation_date: e.target.value })} 
                                style={styles.input} 
                            />
                        </div>

                        <div style={styles.infoBox}>
                            <Info size={16} color="#3b82f6" />
                            <p style={styles.infoText}>Eligibility: 90 days for Men, 120 days for Women.</p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{...styles.submitBtn, opacity: loading ? 0.7 : 1}}
                        >
                            {loading ? "PROCESSING..." : "CONFIRM REGISTRATION"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageBackground: { backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '40px 20px', fontFamily: "'Inter', sans-serif" },
    contentWrapper: { width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px' },
    backBtnWrapper: { alignSelf: 'flex-start', marginBottom: '12px' },
    backBtn: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        border: 'none', 
        background: 'none', 
        cursor: 'pointer', 
        color: '#64748b', 
        padding: '8px 0px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    backIconCircle: { 
        width: '36px', 
        height: '36px', 
        borderRadius: '12px', 
        backgroundColor: '#ffffff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', 
        border: '1px solid #e2e8f0' 
    },
    backText: { fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' },
    formCard: { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
    formHeader: { textAlign: 'center', marginBottom: '32px' },
    iconHeader: { marginBottom: '16px' },
    title: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' },
    subtitle: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' },
    label: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: '#475569', marginBottom: '8px', letterSpacing: '0.5px' },
    inputGroup: { marginBottom: '20px' },
    row: { display: 'flex', gap: '15px', marginBottom: '20px' },
    input: { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fcfdfe' },
    statusBanner: { padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' },
    successBanner: { backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #10b981' },
    errorBanner: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #ef4444' },
    infoBox: { display: 'flex', gap: '10px', backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #dbeafe' },
    infoText: { fontSize: '12px', color: '#1e40af', margin: 0, lineHeight: '1.5' },
    submitBtn: { width: '100%', padding: '16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)' }
};

export default RegisterDonor;