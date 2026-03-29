import { useState } from 'react';
import { Icon, ICONS } from './components/shared/UIComponents';
import DashboardSection from './components/sections/DashboardSection';
import CarsSection from './components/sections/CarsSection';
import EmployeesSection from './components/sections/EmployeesSection';
import CustomersSection from './components/sections/CustomersSection';
import InvoicesSection from './components/sections/InvoicesSection';
import ReportsSection from './components/sections/ReportsSection';
import AnalyticsSection from './components/sections/AnalyticsSection';
import ProfileSection from './components/sections/ProfileSection';
import './index.css';

const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: ICONS.report },
    { key: 'cars', label: 'Cars', icon: ICONS.car },
    { key: 'employees', label: 'Employees', icon: ICONS.employee },
    { key: 'customers', label: 'Customers', icon: ICONS.customer },
    { key: 'invoices', label: 'Invoices', icon: ICONS.invoice },
    { key: 'reports', label: 'Reports', icon: ICONS.report },
    { key: 'analytics', label: 'Analytics', icon: ICONS.analytics },
    { key: 'profile', label: 'Profile', icon: ICONS.user },
];

function App({ user, onLogout, onBackHome, onUpdateUser }) {
    const [tab, setTab] = useState('dashboard');

    const SECTIONS = {
        dashboard: <DashboardSection setTab={setTab} />,
        cars: <CarsSection />,
        employees: <EmployeesSection />,
        customers: <CustomersSection />,
        invoices: <InvoicesSection />,
        reports: <ReportsSection />,
        analytics: <AnalyticsSection />,
        profile: <ProfileSection user={user} onUpdateUser={onUpdateUser} />,
    };

    return (
        <div className="flex h-screen text-white overflow-hidden bg-[#05050f] selection:bg-blue-500/30">

            {/* ── Ambient Background Meshes ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[140px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-900/15 blur-[120px] mix-blend-screen" />
            </div>

            {/* ── Premium Sidebar ── */}
            <aside className="w-[280px] flex flex-col shrink-0 relative z-20 m-4 rounded-[2rem] glass-panel transition-all"
                style={{
                    background: 'linear-gradient(160deg, rgba(16,20,40,0.85) 0%, rgba(5,5,15,0.7) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}>

                {/* Vertical Blue Line Accent */}
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent pointer-events-none" />

                {/* Logo Area */}
                <div className="px-8 py-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="relative group cursor-pointer">
                            <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-full group-hover:bg-blue-500/50 transition-colors" />
                            <img src="/images/bmw-logo.png" alt="BMW" className="h-11 w-auto relative z-10 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
                                onError={e => e.target.style.display = 'none'} />
                        </div>
                        <div>
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white font-extrabold text-lg tracking-widest leading-none mb-1">KAPP<span className="text-white font-medium">-BMW</span></p>
                            <p className="text-blue-400/70 text-[10px] uppercase tracking-[0.2em] font-medium">Dealership System</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
                    {NAV_ITEMS.map(item => {
                        const isActive = tab === item.key;
                        return (
                            <button key={item.key} onClick={() => setTab(item.key)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-semibold tracking-wide transition-all duration-300 relative group overflow-hidden ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                style={isActive ? {
                                    background: 'linear-gradient(135deg, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0.05) 100%)',
                                    border: '1px solid rgba(59,130,246,0.3)',
                                    boxShadow: '0 8px 32px rgba(37,99,235,0.15)',
                                } : { border: '1px solid transparent' }}>
                                
                                {/* Hover background for inactive items */}
                                {!isActive && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}

                                {/* Active left glow bar */}
                                {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />}
                                
                                <span className={isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-gray-500 group-hover:text-gray-300 transition-colors'}>
                                    <Icon path={item.icon} size={18} />
                                </span>
                                <span className="relative z-10">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer / Profile */}
                <div className="p-4 mt-auto">
                    {user && (
                        <div className="p-1 rounded-[1.25rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0a0f1d]/80">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                                    <div className="w-full h-full rounded-full bg-[#05050f] overflow-hidden flex items-center justify-center">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <Icon path={ICONS.user} size={18} className="text-blue-400" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="text-white text-sm font-bold truncate tracking-wide">{user.name}</p>
                                    <p className="text-blue-400 text-[10px] uppercase tracking-wider font-semibold truncate">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex gap-3">
                        {onBackHome && (
                            <button onClick={onBackHome}
                                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white glass-button hover:bg-white/10 text-center">
                                Portal
                            </button>
                        )}
                        {onLogout && (
                            <button onClick={onLogout}
                                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all text-center">
                                Disconnect
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* ── Main Dashboard Content ── */}
            <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <div className="max-w-7xl mx-auto p-10 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {SECTIONS[tab]}
                </div>
            </main>
        </div>
    );
}

export default App;
