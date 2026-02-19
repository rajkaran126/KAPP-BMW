import { useRef, useState } from 'react';

export default function HomePage({ onEnterDashboard, user, onLogout }) {
    const videoRef = useRef(null);
    const [videoError, setVideoError] = useState(false);
    const [muted, setMuted] = useState(true);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(v => !v);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a18] text-white overflow-x-hidden">

            {/* ── Navbar ── */}
            <nav className="fixed top-0 left-0 w-full z-50 px-8 py-4 flex items-center justify-between"
                style={{
                    background: 'rgba(10,10,24,0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                <div className="flex items-center gap-3">
                    <img src="/images/bmw-logo.png" alt="BMW" className="h-9 w-auto"
                        onError={e => e.target.style.display = 'none'} />
                    <div>
                        <span className="font-bold text-lg tracking-wide" style={{ color: '#1c69d4' }}>KAPP</span>
                        <span className="font-bold text-lg text-white">-BMW</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {user && (
                        <span className="text-gray-400 text-sm hidden sm:block">
                            Welcome, <span className="text-white font-medium">{user.name}</span>
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs"
                                style={{ background: 'rgba(28,105,212,0.2)', color: '#60a5fa', border: '1px solid rgba(28,105,212,0.3)' }}>
                                {user.role}
                            </span>
                        </span>
                    )}
                    <button onClick={onEnterDashboard}
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #1c69d4, #0d47a1)',
                            boxShadow: '0 4px 20px rgba(28,105,212,0.4)',
                        }}>
                        Dashboard →
                    </button>
                    {user && (
                        <button onClick={onLogout}
                            className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-all"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                            Logout
                        </button>
                    )}
                </div>
            </nav>

            {/* ── Hero Section with Video ── */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Video Background */}
                {!videoError ? (
                    <video ref={videoRef} autoPlay loop muted playsInline
                        onError={() => setVideoError(true)}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: 'brightness(0.4)' }}>
                        <source src="/videos/hero.mp4" type="video/mp4" />
                        <source src="/videos/hero.webm" type="video/webm" />
                    </video>
                ) : (
                    <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #0a0a18 50%, #0d1b3e 100%)' }}>
                        <div className="absolute inset-0 opacity-30"
                            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #1c69d4 0%, transparent 50%), radial-gradient(circle at 70% 50%, #0d47a1 0%, transparent 50%)' }} />
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(10,10,24,0.2) 0%, rgba(10,10,24,0.45) 60%, rgba(10,10,24,1) 100%)' }} />

                {/* Mute button */}
                {!videoError && (
                    <button onClick={toggleMute}
                        className="absolute bottom-8 right-8 z-20 p-3 rounded-full text-white transition-all hover:scale-110"
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}>
                        {muted ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                            </svg>
                        )}
                    </button>
                )}

                {/* Hero Content */}
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    {/* Glass badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-blue-300 text-sm mb-8"
                        style={{
                            background: 'rgba(28,105,212,0.12)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '1px solid rgba(28,105,212,0.25)',
                        }}>
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        BMW Premium Sales Management
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-none">
                        <span style={{ color: '#1c69d4' }}>KAPP</span>
                        <span className="text-white">-BMW</span>
                    </h1>
                    <p className="text-gray-300 text-xl md:text-2xl mb-4 font-light">
                        Premium Automobile Showroom
                    </p>
                    <p className="text-gray-500 text-base mb-12 max-w-xl mx-auto">
                        Manage your entire BMW dealership — inventory, staff, customers, and sales — all in one powerful platform.
                    </p>

                    {/* Glass CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={onEnterDashboard}
                            className="px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #1c69d4, #0d47a1)',
                                boxShadow: '0 8px 32px rgba(28,105,212,0.5)',
                            }}>
                            Enter Dashboard
                        </button>
                        <a href="#features"
                            className="px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105"
                            style={{
                                background: 'rgba(255,255,255,0.07)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                            }}>
                            Learn More ↓
                        </a>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 text-xs animate-bounce">
                    <span>Scroll</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                </div>
            </section>

            {/* Video hint */}
            {videoError && (
                <div className="fixed bottom-4 left-4 z-50 px-4 py-3 rounded-xl text-yellow-400 text-xs max-w-xs"
                    style={{
                        background: 'rgba(234,179,8,0.08)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(234,179,8,0.2)',
                    }}>
                    💡 Add your video at <code className="bg-black/30 px-1 rounded">public/videos/hero.mp4</code>
                </div>
            )}

            {/* ── Features Section ── */}
            <section id="features" className="py-24 px-8 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
                    <p className="text-gray-400 text-lg">A complete BMW dealership management platform</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: 'Car Inventory', desc: 'Track every BMW with model, colour, year, and live availability status.' },
                        { title: 'Employee Management', desc: 'Manage sales staff with qualifications and performance tracking.' },
                        { title: 'Customer Database', desc: 'Full customer profiles with phone, city, country, and purchase history.' },
                        { title: 'Sales Invoices', desc: 'Create invoices that automatically update car availability in real time.' },
                        { title: 'Sales Reports', desc: 'Generate detailed reports on employee performance and car availability.' },
                        { title: 'AI Assistant', desc: 'Ask your AI assistant anything about your dealership data.' },
                    ].map((f, i) => (
                        <div key={i} className="p-6 rounded-2xl transition-all group hover:scale-[1.02] cursor-default"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                            }}
                            onMouseEnter={e => e.currentTarget.style.border = '1px solid rgba(28,105,212,0.35)'}
                            onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'}>
                            <div className="text-4xl mb-4">{f.icon}</div>
                            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors">{f.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            

            {/* ── CTA Section ── */}
            <section className="py-24 px-8 text-center">
                <div className="max-w-2xl mx-auto p-12 rounded-3xl"
                    style={{
                        background: 'rgba(28,105,212,0.08)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(28,105,212,0.2)',
                        boxShadow: '0 8px 40px rgba(28,105,212,0.15)',
                    }}>
                    <h2 className="text-4xl font-bold text-white mb-4">Ready to manage your showroom?</h2>
                    <p className="text-gray-400 mb-8">Access the full dashboard with all management tools.</p>
                    <button onClick={onEnterDashboard}
                        className="px-10 py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #1c69d4, #0d47a1)',
                            boxShadow: '0 8px 30px rgba(28,105,212,0.4)',
                        }}>
                        Open Dashboard →
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-8 px-8 text-center"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-gray-600 text-sm">© 2026 KAPP-BMW Automobile. All rights reserved.</p>
            </footer>
        </div>
    );
}
