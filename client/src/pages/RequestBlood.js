import React, { useState } from 'react';
import axios from 'axios';
import { 
    Search, Droplet, User, Package, ArrowLeft, 
    CheckCircle2, AlertCircle, Clock 
} from 'lucide-react';

const RequestBlood = ({ onNavigate}) => {
    const [request, setRequest] = useState({
        requester_name: '',
        blood_group: 'O+',
        component_type: 'Whole Blood',
        quantity: 1
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post('http://localhost:5000/api/requests', request);
            setStatus({ 
                type: 'success', 
                message: "Urgent request submitted! Our staff is currently reviewing the live inventory." 
            });
            
            // Auto-redirect after success
            setTimeout(() => onNavigate('home'), 3000);
        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.response?.data?.message || "Failed to submit request. Please check your connection." 
            });
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
                        onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                    >
                        <div style={styles.backIconCircle}>
                            <ArrowLeft size={16} />
                        </div>
                        <span style={styles.backText}>Return to Dashboard</span>
                    </button>
                </div>

                <div style={styles.formCard}>
                    <div style={styles.formHeader}>
                        <div style={styles.iconHeader}>
                            <div style={styles.pulseContainer}>
                                <Search size={28} color="#ef4444" />
                            </div>
                        </div>
                        <h2 style={styles.title}>Request Blood Unit</h2>
                        <p style={styles.subtitle}>Submit an urgent requirement to query our live inventory.</p>
                    </div>

                    {/* STATUS BANNERS */}
                    {status.message && (
                        <div style={{
                            ...styles.statusBanner,
                            ...(status.type === 'success' ? styles.successBanner : styles.errorBanner)
                        }}>
                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleRequest}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}><User size={14} /> PATIENT / REQUESTER NAME</label>
                            <input 
                                placeholder="Enter full legal name" 
                                style={styles.input} 
                                onChange={e => setRequest({...request, requester_name: e.target.value})}
                                required 
                            />
                        </div>

                        <div style={styles.row}>
                            <div style={{flex: 1}}>
                                <label style={styles.label}><Droplet size={14} /> BLOOD GROUP</label>
                                <select style={styles.input} onChange={e => setRequest({...request, blood_group: e.target.value})}>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{flex: 1}}>
                                <label style={styles.label}><Package size={14} /> COMPONENT</label>
                                <select style={styles.input} onChange={e => setRequest({...request, component_type: e.target.value})}>
                                    <option value="Whole Blood">Whole Blood</option>
                                    <option value="Plasma">Plasma</option>
                                    <option value="Platelets">Platelets</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}><Clock size={14} /> QUANTITY (UNITS)</label>
                            <input 
                                type="number" 
                                min="1" 
                                placeholder="Units Needed" 
                                style={styles.input} 
                                value={request.quantity}
                                onChange={e => setRequest({...request, quantity: e.target.value})}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{...styles.submitBtn, opacity: loading ? 0.7 : 1}}
                        >
                            {loading ? "SUBMITTING..." : "SUBMIT URGENT REQUEST"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageBackground: {
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: "'Inter', sans-serif"
    },
    contentWrapper: { width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px' },
    
    // BACK BUTTON
    backBtnWrapper: { alignSelf: 'flex-start', marginBottom: '8px' },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#64748b',
        padding: '8px 4px',
        transition: 'all 0.2s ease',
    },
    backIconCircle: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0'
    },
    backText: { fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' },

    // FORM CARD
    formCard: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0'
    },
    formHeader: { textAlign: 'center', marginBottom: '32px' },
    pulseContainer: {
        backgroundColor: '#fee2e2',
        padding: '15px',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'pulse 2s infinite'
    },
    title: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '15px 0 8px 0' },
    subtitle: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' },
    
    label: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: '#475569', marginBottom: '8px', letterSpacing: '0.5px' },
    inputGroup: { marginBottom: '20px' },
    row: { display: 'flex', gap: '15px', marginBottom: '20px' },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        backgroundColor: '#fcfdfe',
        transition: 'border-color 0.2s ease'
    },

    statusBanner: { padding: '14px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', lineHeight: '1.4' },
    successBanner: { backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #10b981' },
    errorBanner: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #ef4444' },

    submitBtn: {
        width: '100%',
        padding: '16px',
        backgroundColor: '#0f172a', // Deep navy for "Emergency Search" feel
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '15px',
        cursor: 'pointer',
        boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)',
        transition: 'transform 0.2s ease'
    }
};

export default RequestBlood;