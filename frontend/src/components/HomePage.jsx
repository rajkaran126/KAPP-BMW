import { useRef, useState, useEffect } from 'react';

export default function HomePage({ onEnterDashboard, user, onLogout }) {
    const videoRef = useRef(null);
    const [videoError, setVideoError] = useState(false);
    const [muted, setMuted] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(!muted);
        }
    };

    return (
        <div className="min-h-screen bg-[#05050f] text-white overflow-x-hidden selection:bg-blue-500/30">

            {/* ── Dynamic Background Mesh ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[100px] mix-blend-screen" />
            </div>

            {/* ── Premium Navbar ── */}
            <nav className={`fixed top-0 left-0 w-full z-50 px-8 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'}`}>
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/40 transition-colors duration-500" />
                        <img src="/images/bmw-logo.png" alt="BMW" className="h-10 w-auto relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform duration-500 group-hover:rotate-12"
                            onError={e => e.target.style.display = 'none'} />
                    </div>
                    <div>
                        <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">KAPP</span>
                        <span className="font-bold text-xl text-white tracking-wide">-BMW</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    {user && (
                        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="text-gray-400 text-sm">Welcome, <span className="text-white font-semibold">{user.name}</span></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        </div>
                    )}
                    <button onClick={onEnterDashboard}
                        className="glass-button px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-105">
                        Dashboard →
                    </button>
                    {user && (
                        <button onClick={onLogout}
                            className="px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-all hover:bg-white/10">
                            Logout
                        </button>
                    )}
                </div>
            </nav>

            {/* ── Cinematic Hero ── */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {!videoError && (
                    <video ref={videoRef} autoPlay loop muted playsInline
                        onError={() => setVideoError(true)}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        style={{ filter: 'brightness(0.6) contrast(1.1) saturate(1.2)' }}>
                        <source src="/videos/hero.mp4" type="video/mp4" />
                        <source src="/videos/hero.webm" type="video/webm" />
                    </video>
                )}
                
                {/* Vignette Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, #05050f 100%)' }} />
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#05050f]/60 via-transparent to-[#05050f]" />

                {/* Hero Content */}
                <div className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center mt-20">
                    <div className="animate-float mb-10">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                            <span className="text-sm font-medium text-blue-100 uppercase tracking-widest">Premium Dealership Experience</span>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-6 leading-[1.1]">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-900 drop-shadow-[0_0_40px_rgba(37,99,235,0.3)]">KAPP</span>
                        <span className="text-white drop-shadow-2xl">-BMW</span>
                    </h1>
                    
                    <p className="text-gray-300 text-xl md:text-3xl mb-12 font-light max-w-3xl leading-relaxed text-glow">
                        Elevating automotive management with unparalleled precision and design.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-lg">
                        <button onClick={onEnterDashboard}
                            className="glass-button flex-1 py-4 px-8 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 shadow-[0_10px_40px_rgba(37,99,235,0.5)] transform hover:-translate-y-1">
                            Launch Platform
                        </button>
                        <a href="#features"
                            className="glass-button flex-1 py-4 px-8 rounded-2xl font-bold text-lg bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl border border-white/20 transform hover:-translate-y-1 text-center">
                            Explore Features
                        </a>
                    </div>
                </div>

                {/* Mute toggle */}
                {!videoError && (
                    <button onClick={toggleMute}
                        className="absolute bottom-12 right-12 z-30 p-4 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 shadow-2xl">
                        {muted ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" /></svg>
                        )}
                    </button>
                )}


            </section>

            {videoError && (
                <div className="fixed bottom-6 left-6 z-50 px-5 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl text-amber-200 text-sm flex items-center gap-3 shadow-[0_8px_32px_rgba(217,119,6,0.2)]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>To view the cinematic background, add standard videos at <code className="bg-black/50 px-2 py-0.5 rounded text-amber-100 font-mono">public/videos/hero.mp4</code></span>
                </div>
            )}

            {/* ── Breathtaking Features Grid ── */}
            <section id="features" className="py-32 relative z-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight relative z-10">Command Performance</h2>
                        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto relative z-10">
                            A completely integrated ecosystem engineered for automotive excellence.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Car Inventory', icon: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v5M16 17h2a2 2 0 002-2v-1M9 17a2 2 0 104 0 2 2 0 00-4 0M20 17a2 2 0 104 0 2 2 0 00-4 0', desc: 'Track every BMW with model, color, year, and live availability status.' },
                            { title: 'Employee Management', icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8', desc: 'Manage your sales staff with qualifications and performance tracking.' },
                            { title: 'Customer Database', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', desc: 'Full customer profiles with phone numbers, city, country, and purchase history.' },
                            { title: 'Sales Invoices', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', desc: 'Create invoices that automatically update your car availability in real time.' },
                            { title: 'Sales Reports', icon: 'M18 20V10M12 20V4M6 20v-6', desc: 'Generate detailed reports on employee performance and car availability.' },
                            { title: 'Analytics Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', desc: 'Visual charts and business insights powered by your real-time dealership data.' },
                        ].map((f, i) => (
                            <div key={i} className="glass-panel p-10 rounded-[2rem] group cursor-default shadow-xl hover:shadow-[0_20px_60px_rgba(37,99,235,0.15)] transition-all duration-500 hover:-translate-y-2">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/5 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-500 shadow-[inset_0_0_20px_rgba(37,99,235,0.2)]">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon}/></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-300 transition-all">{f.title}</h3>
                                <p className="text-gray-400 leading-relaxed font-light">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Immersive CTA ── */}
            <section className="py-32 px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="relative overflow-hidden rounded-[3rem] p-16 md:p-24 text-center border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#0a0f25] to-[#050510] -z-10" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Experience Control</h2>
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
                            Step into the command center and drive your dealership's success with unprecedented clarity.
                        </p>
                        
                        <button onClick={onEnterDashboard}
                            className="glass-button px-12 py-5 rounded-full font-bold text-xl text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] transform hover:scale-105 inline-flex items-center gap-3 group">
                            Access Dashboard
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            </section>

            <footer className="py-10 text-center relative z-10 border-t border-white/5 bg-[#030308]">
                <p className="text-gray-600 text-sm tracking-wide font-medium">© 2026 KAPP-BMW DEALERSHIP SYSTEM</p>
            </footer>
        </div>
    );
}
