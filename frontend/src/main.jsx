import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import LoadingScreen from './components/LoadingScreen';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import App from './App';
import './index.css';

const SESSION_KEY = 'kapp_bmw_session';

/**
 * App flow:
 *  loading → auth (skip if session exists) → home → dashboard
 */
function Root() {
    const [phase, setPhase] = useState('loading'); // loading | auth | home | dashboard
    const [user, setUser] = useState(null);

    const handleLoadingDone = useCallback(() => {
        // Restore session from localStorage
        try {
            const saved = localStorage.getItem(SESSION_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed?.username) {
                    setUser(parsed);
                    setPhase('home'); // skip login
                    return;
                }
            }
        } catch { /* ignore corrupt storage */ }
        setPhase('auth');
    }, []);

    const handleLogin = useCallback((userData) => {
        setUser(userData);
        // Persist session so device stays logged in
        try { localStorage.setItem(SESSION_KEY, JSON.stringify(userData)); } catch { }
        setPhase('home');
    }, []);

    const handleEnterDashboard = useCallback(() => setPhase('dashboard'), []);

    const handleLogout = useCallback(() => {
        setUser(null);
        try { localStorage.removeItem(SESSION_KEY); } catch { }
        setPhase('auth');
    }, []);

    const handleBackHome = useCallback(() => setPhase('home'), []);

    const handleUpdateUser = useCallback((updates) => {
        setUser(prev => {
            const updated = { ...prev, ...updates };
            // Keep localStorage in sync with any profile changes
            try { localStorage.setItem(SESSION_KEY, JSON.stringify(updated)); } catch { }
            return updated;
        });
    }, []);

    return (
        <>
            {phase === 'loading' && <LoadingScreen onDone={handleLoadingDone} />}
            {phase === 'auth' && <AuthPage onLogin={handleLogin} />}
            {phase === 'home' && (
                <HomePage
                    user={user}
                    onEnterDashboard={handleEnterDashboard}
                    onLogout={handleLogout}
                />
            )}
            {phase === 'dashboard' && (
                <App
                    user={user}
                    onLogout={handleLogout}
                    onBackHome={handleBackHome}
                    onUpdateUser={handleUpdateUser}
                />
            )}
        </>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
