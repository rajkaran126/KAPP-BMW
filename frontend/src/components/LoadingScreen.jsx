import { useEffect, useState } from 'react';

export default function LoadingScreen({ onDone }) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState('Initializing...');

    useEffect(() => {
        const phases = [
            { pct: 20, label: 'Connecting to database...' },
            { pct: 45, label: 'Loading BMW inventory...' },
            { pct: 70, label: 'Preparing dashboard...' },
            { pct: 90, label: 'Almost ready...' },
            { pct: 100, label: 'Welcome to KAPP-BMW' },
        ];
        let i = 0;
        const tick = () => {
            if (i < phases.length) {
                setProgress(phases[i].pct);
                setPhase(phases[i].label);
                i++;
                setTimeout(tick, i === phases.length ? 600 : 500);
            } else {
                setTimeout(onDone, 400);
            }
        };
        setTimeout(tick, 300);
    }, [onDone]);

    return (
        <div className="fixed inset-0 z-[200] bg-[#0a0a18] flex flex-col items-center justify-center">
            {/* Background radial glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(28,105,212,0.15) 0%, transparent 70%)' }} />
            </div>

            {/* Logo */}
            <div className="relative mb-10 text-center">
                <img src="/images/bmw-logo.png" alt="BMW" className="h-20 w-auto mx-auto mb-4 drop-shadow-2xl"
                    onError={e => e.target.style.display = 'none'} />
                <h1 className="text-4xl font-bold tracking-widest text-white">
                    <span style={{ color: '#1c69d4' }}>KAPP</span>-BMW
                </h1>
                <p className="text-gray-500 text-sm mt-1 tracking-widest uppercase">Sales Management System</p>
            </div>

            {/* Progress bar */}
            <div className="w-72 mb-4">
                <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #1c69d4, #60a5fa)' }} />
                </div>
            </div>

            {/* Phase label */}
            <p className="text-gray-400 text-sm tracking-wide">{phase}</p>

            {/* Spinning ring */}
            <div className="mt-8">
                <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
            </div>
        </div>
    );
}
