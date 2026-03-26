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
        <div className="flex h-screen text-white overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #060614 0%, #0a0a18 100%)' }}>

            {/* Ambient glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(28,105,212,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(13,71,161,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            {/* ── Sidebar ── */}
            <aside className="w-60 flex flex-col shrink-0 relative z-10"
                style={{
                    background: 'linear-gradient(180deg, rgba(8,8,22,0.95) 0%, rgba(10,10,26,0.9) 100%)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
                }}>

                {/* Logo */}
                <div className="px-5 py-6 relative overflow-hidden"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* Subtle blue glow behind logo */}
                    <div className="absolute inset-0 opacity-40"
                        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(28,105,212,0.18) 0%, transparent 70%)' }} />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full blur-sm"
                                style={{ background: 'rgba(28,105,212,0.3)' }} />
                            <img src="/images/bmw-logo.png" alt="BMW" className="h-9 w-auto relative"
                                onError={e => e.target.style.display = 'none'} />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm leading-tight tracking-wide">KAPP-BMW</p>
                            <p className="text-blue-400/60 text-xs">Sales Management</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map(item => {
                        const isActive = tab === item.key;
                        return (
                            <button key={item.key} onClick={() => setTab(item.key)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-200 hover:bg-white/6'
                                    }`}
                                style={isActive ? {
                                    background: 'linear-gradient(135deg, rgba(28,105,212,0.85) 0%, rgba(13,71,161,0.8) 100%)',
                                    boxShadow: '0 4px 16px rgba(28,105,212,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                                    borderLeft: '2px solid rgba(96,165,250,0.6)',
                                } : {}}>
                                <span className={isActive ? 'text-blue-300' : ''}>
                                    <Icon path={item.icon} size={17} />
                                </span>
                                {item.label}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* User chip */}
                    {user && (
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl mb-3"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-blue-500/30 shrink-0"
                                style={{ background: 'rgba(28,105,212,0.2)' }}>
                                {user.avatar ? (
                                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-blue-400">
                                        <Icon path={ICONS.user} size={18} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                                <p className="text-blue-400 text-xs truncate">{user.role}</p>
                            </div>
                        </div>
                    )}
                    {/* Action buttons */}
                    <div className="flex gap-2">
                        {onBackHome && (
                            <button onClick={onBackHome}
                                className="flex-1 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
                                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                                Home
                            </button>
                        )}
                        {onLogout && (
                            <button onClick={onLogout}
                                className="flex-1 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 transition-colors"
                                style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
                                Logout
                            </button>
                        )}
                    </div>
                    <p className="text-gray-700 text-xs text-center mt-3">KAPP-BMW © 2026</p>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto px-8 py-8">
                    {SECTIONS[tab]}
                </div>
            </main>
        </div>
    );
}

export default App;
