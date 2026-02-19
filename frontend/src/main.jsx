import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import LoadingScreen from './components/LoadingScreen';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import App from './App';
import './index.css';

/**
 * App flow:
 *  loading → auth → home → dashboard
 */
function Root() {
    const [phase, setPhase] = useState('loading'); // loading | auth | home | dashboard
    const [user, setUser] = useState(null);

    const handleLoadingDone = useCallback(() => setPhase('auth'), []);

    const handleLogin = useCallback((userData) => {
        setUser(userData);
        setPhase('home');
    }, []);

    const handleEnterDashboard = useCallback(() => setPhase('dashboard'), []);

    const handleLogout = useCallback(() => {
        setUser(null);
        setPhase('auth');
    }, []);

    const handleBackHome = useCallback(() => setPhase('home'), []);

    const handleUpdateUser = useCallback((updates) => {
        setUser(prev => ({ ...prev, ...updates }));
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
