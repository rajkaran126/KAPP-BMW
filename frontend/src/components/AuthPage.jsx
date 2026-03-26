import { useState } from 'react';
import { authAPI } from '../utils/api';

const GLASS_DARK = {
    background: 'rgba(10,10,24,0.7)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
};

export default function AuthPage({ onLogin }) {
    const [mode, setMode] = useState('login');         // 'login' | 'signup' | 'forgot'
    const [form, setForm] = useState({ name: '', username: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({});

    // Forgot-password states
    const [resetForm, setResetForm] = useState({ username: '', newPassword: '', confirmPassword: '' });
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');

    const handleChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); };
    const handleResetChange = e => { setResetForm(f => ({ ...f, [e.target.name]: e.target.value })); setResetError(''); };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                const response = await authAPI.login({
                    username: form.username,
                    password: form.password
                });
                onLogin(response.data);
            } else {
                // Signup mode
                if (form.password !== form.confirm) { setError('Passwords do not match.'); setLoading(false); return; }
                if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }

                const response = await authAPI.signup({
                    name: form.name || form.username,
                    username: form.username,
                    password: form.password,
                    role: 'Staff'
                });
                onLogin(response.data);
            }
        } catch (err) {
            if (!err.response) {
                setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
            } else {
                setError(err.response?.data?.error || 'Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async e => {
        e.preventDefault();
        setResetError('Password reset validation not implemented in backend yet. Please contact admin.');
    };

    const switchTab = m => {
        setMode(m);
        setError('');
        setResetForm({ username: '', newPassword: '', confirmPassword: '' });
        setResetSuccess(false);
        setResetError('');
        setForm({ name: '', username: '', password: '', confirm: '' });
        setShowPasswords({});
    };

    /* ─── Eye icon toggle button ─── */
    const EyeButton = ({ fieldName, visible, onToggle }) => (
        <button type="button"
            onClick={onToggle ? onToggle : () => setShowPasswords(p => ({ ...p, [fieldName]: !p[fieldName] }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            tabIndex={-1}
            aria-label={visible ? 'Hide password' : 'Show password'}>
            {visible ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            )}
        </button>
    );

    const inputBase = {
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
    };
    const inputClass = "w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none placeholder-gray-600 transition-all";

    return (
        <div className="fixed inset-0 z-[150] flex overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #060614 0%, #0a0a18 50%, #060d24 100%)' }}>

            {/* Ambient glow blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(28,105,212,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(13,71,161,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            {/* Left panel — branding */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative">
                <div className="absolute inset-4 rounded-3xl pointer-events-none"
                    style={{ background: 'rgba(28,105,212,0.05)', backdropFilter: 'blur(4px)', border: '1px solid rgba(28,105,212,0.12)' }} />

                <div className="relative z-10 flex items-center gap-3">
                    <img src="/images/bmw-logo.png" alt="BMW" className="h-12 w-auto"
                        onError={e => e.target.style.display = 'none'} />
                    <div>
                        <p className="text-white font-bold text-xl tracking-wide">KAPP-BMW</p>
                        <p className="text-xs tracking-widest uppercase" style={{ color: '#60a5fa' }}>Sales Management</p>
                    </div>
                </div>

                <div className="relative z-10">
                    <h2 className="text-5xl font-bold text-white leading-tight mb-4">
                        Drive Your<br />
                        <span style={{ color: '#1c69d4' }}>Sales</span> Forward
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Complete BMW dealership management — inventory, employees, customers, and sales invoices.
                    </p>
                </div>

                <div className="relative z-10" />
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="p-8 rounded-3xl" style={GLASS_DARK}>

                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <img src="/images/bmw-logo.png" alt="BMW" className="h-10 w-auto"
                                onError={e => e.target.style.display = 'none'} />
                            <p className="text-white font-bold text-lg">KAPP-BMW</p>
                        </div>

                        {/* ── FORGOT PASSWORD / RESET VIEW ── */}
                        {mode === 'forgot' ? (
                            <>
                                <button onClick={() => switchTab('login')}
                                    className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                    Back to Sign In
                                </button>

                                {resetSuccess ? (
                                    /* Success state */
                                    <div className="text-center py-4">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                                            style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                            Your password has been successfully updated. You can now sign in with your new credentials.
                                        </p>
                                        <button onClick={() => switchTab('login')}
                                            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02]"
                                            style={{ background: 'linear-gradient(135deg, #1c69d4, #0d47a1)', boxShadow: '0 4px 20px rgba(28,105,212,0.4)' }}>
                                            Sign In Now
                                        </button>
                                    </div>
                                ) : (
                                    /* Reset Form */
                                    <>
                                        <h3 className="text-2xl font-bold text-white mb-1">Reset Password</h3>
                                        <p className="text-gray-400 text-sm mb-7">
                                            Create a new password for your account.
                                        </p>

                                        <form onSubmit={handleResetSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-1.5">Username</label>
                                                <input
                                                    name="username"
                                                    type="text"
                                                    value={resetForm.username}
                                                    onChange={handleResetChange}
                                                    placeholder="Enter username"
                                                    autoComplete="username"
                                                    required
                                                    className={inputClass}
                                                    style={inputBase}
                                                    onFocus={e => e.target.style.border = '1px solid rgba(28,105,212,0.6)'}
                                                    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'} />
                                            </div>

                                            <div>
                                                <label className="block text-gray-400 text-sm mb-1.5">New Password</label>
                                                <div className="relative">
                                                    <input
                                                        name="newPassword"
                                                        type={showPasswords['newPassword'] ? 'text' : 'password'}
                                                        value={resetForm.newPassword}
                                                        onChange={handleResetChange}
                                                        placeholder="Min 6 characters"
                                                        required
                                                        className={inputClass}
                                                        style={{ ...inputBase, paddingRight: '2.75rem' }}
                                                        onFocus={e => e.target.style.border = '1px solid rgba(28,105,212,0.6)'}
                                                        onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'} />
                                                    <EyeButton fieldName="newPassword" visible={showPasswords['newPassword']} />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-gray-400 text-sm mb-1.5">Confirm Password</label>
                                                <div className="relative">
                                                    <input
                                                        name="confirmPassword"
                                                        type={showPasswords['confirmPassword'] ? 'text' : 'password'}
                                                        value={resetForm.confirmPassword}
                                                        onChange={handleResetChange}
                                                        placeholder="Repeat new password"
                                                        required
                                                        className={inputClass}
                                                        style={{ ...inputBase, paddingRight: '2.75rem' }}
                                                        onFocus={e => e.target.style.border = '1px solid rgba(28,105,212,0.6)'}
                                                        onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'} />
                                                    <EyeButton fieldName="confirmPassword" visible={showPasswords['confirmPassword']} />
                                                </div>
                                            </div>

                                            {resetError && (
                                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 text-sm"
                                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                                    </svg>
                                                    {resetError}
                                                </div>
                                            )}

                                            <button type="submit" disabled={resetLoading}
                                                className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
                                                style={{ background: 'linear-gradient(135deg, #1c69d4, #0d47a1)', boxShadow: '0 4px 20px rgba(28,105,212,0.4)' }}>
                                                {resetLoading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                        Updating...
                                                    </span>
                                                ) : 'Reset Password'}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </>
                        ) : (
                            /* ── LOGIN / SIGNUP VIEWS ── */
                            <>
                                {/* Tab switcher */}
                                <div className="flex p-1 mb-8 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['login', 'signup'].map(m => (
                                        <button key={m}
                                            onClick={() => switchTab(m)}
                                            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                                            style={mode === m ? {
                                                background: 'linear-gradient(135deg, #1c69d4, #0d47a1)',
                                                color: '#fff',
                                                boxShadow: '0 4px 15px rgba(28,105,212,0.4)',
                                            } : { color: '#9ca3af' }}>
                                            {m === 'login' ? 'Sign In' : 'Sign Up'}
                                        </button>
                                    ))}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-1">
                                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                                </h3>
                                <p className="text-gray-400 text-sm mb-7">
                                    {mode === 'login' ? 'Sign in to access the dashboard' : 'Register to get started'}
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {mode === 'signup' && (
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-1.5">Full Name</label>
                                            <input name="name" value={form.name} onChange={handleChange}
                                                placeholder="Your full name" autoComplete="name"
                                                className={inputClass}
                                                style={inputBase}
                                                onFocus={e => e.target.style.border = '1px solid rgba(28,105,212,0.6)'}
                                                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'} />
                                        </div>
                                    )}

                                    {[
                                        { name: 'username', label: 'Username', type: 'text', ph: 'Enter your username', ac: 'username' },
                                        { name: 'password', label: 'Password', type: 'password', ph: mode === 'login' ? 'Enter your password' : 'Min 6 characters', ac: mode === 'login' ? 'current-password' : 'new-password' },
                                        ...(mode === 'signup' ? [{ name: 'confirm', label: 'Confirm Password', type: 'password', ph: 'Repeat password', ac: 'new-password' }] : []),
                                    ].map(f => {
                                        const isPassword = f.type === 'password';
                                        const visible = showPasswords[f.name];
                                        return (
                                            <div key={f.name}>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="text-gray-400 text-sm">{f.label}</label>
                                                    {isPassword && f.name === 'password' && mode === 'login' && (
                                                        <button type="button"
                                                            onClick={() => switchTab('forgot')}
                                                            className="text-xs transition-colors"
                                                            style={{ color: '#60a5fa' }}
                                                            onMouseEnter={e => e.target.style.color = '#93c5fd'}
                                                            onMouseLeave={e => e.target.style.color = '#60a5fa'}>
                                                            Forgot password?
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <input name={f.name} type={isPassword && visible ? 'text' : f.type} value={form[f.name]} onChange={handleChange}
                                                        placeholder={f.ph} autoComplete={f.ac} required
                                                        className={inputClass}
                                                        style={{ ...inputBase, paddingRight: isPassword ? '2.75rem' : '1rem' }}
                                                        onFocus={e => e.target.style.border = '1px solid rgba(28,105,212,0.6)'}
                                                        onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'} />
                                                    {isPassword && <EyeButton fieldName={f.name} visible={visible} />}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {error && (
                                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-400 text-sm"
                                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                            {error}
                                        </div>
                                    )}

                                    <button type="submit" disabled={loading}
                                        className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02] disabled:opacity-60"
                                        style={{ background: 'linear-gradient(135deg, #1c69d4, #0d47a1)', boxShadow: '0 4px 20px rgba(28,105,212,0.4)' }}>
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                                            </span>
                                        ) : (mode === 'login' ? 'Sign In' : 'Create Account')}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
