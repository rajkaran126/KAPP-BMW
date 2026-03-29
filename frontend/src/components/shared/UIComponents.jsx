import { useEffect } from 'react';

// ─── Icon ──────────────────────────────────────────────────────────────────────
export const Icon = ({ path, size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d={path} />
    </svg>
);

// ─── Icon Paths ────────────────────────────────────────────────────────────────
export const ICONS = {
    car: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v5M16 17h2a2 2 0 002-2v-1M9 17a2 2 0 104 0 2 2 0 00-4 0M20 17a2 2 0 104 0 2 2 0 00-4 0",
    employee: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8",
    customer: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    invoice: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
    report: "M18 20V10M12 20V4M6 20v-6",
    plus: "M12 5v14M5 12h14",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    trash: "M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2",
    close: "M18 6L6 18M6 6l12 12",
    send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
    check: "M20 6L9 17l-5-5",
    warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
    refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
    user: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    analytics: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    spark: "M13 10V3L4 14h7v7l9-11h-7z",
};

// ─── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ status }) {
    const isAvail = status === 'available';
    return (
        <span className="px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase shadow-inner"
            style={{ 
                background: isAvail ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', 
                border: `1px solid ${isAvail ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                color: isAvail ? '#4ade80' : '#f87171',
                boxShadow: isAvail ? '0 0 10px rgba(34,197,94,0.2)' : '0 0 10px rgba(239,68,68,0.2)'
            }}>
            {status}
        </span>
    );
}

// ─── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = 'blue' }) {
    const colors = { 
        blue: { from: '#3b82f6', to: '#1d4ed8', glow: 'rgba(59,130,246,0.3)' },
        green: { from: '#22c55e', to: '#15803d', glow: 'rgba(34,197,94,0.3)' },
        red: { from: '#ef4444', to: '#b91c1c', glow: 'rgba(239,68,68,0.3)' },
        purple: { from: '#a855f7', to: '#7e22ce', glow: 'rgba(168,85,247,0.3)' }
    };
    const c = colors[color] || colors.blue;

    return (
        <div className="glass-panel p-6 rounded-[1.5rem] flex items-center gap-5 transition-transform duration-500 hover:-translate-y-1.5 group cursor-default">
            
            <div className="relative">
                <div className="absolute inset-0 blur-xl opacity-60 rounded-full transition-opacity duration-500 group-hover:opacity-100" style={{ background: c.glow }} />
                <div className="relative p-4 rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-10"
                    style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
                    <Icon path={icon} size={24} className="group-hover:scale-110 transition-transform duration-500" />
                </div>
            </div>

            <div>
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
                <p className="text-white text-3xl font-black tracking-tight" style={{ textShadow: `0 0 20px ${c.glow}` }}>{value}</p>
            </div>
        </div>
    );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" 
            style={{ background: 'rgba(5,5,15,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            onClick={onClose}>
            
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[2rem] glass-panel border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-8 duration-500"
                onClick={e => e.stopPropagation()}>
                
                {/* Decorative top glow */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
                
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 relative">
                        {/* Title glow */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none" />
                        <h3 className="text-2xl font-black text-white tracking-tight relative z-10">{title}</h3>
                        
                        <button onClick={onClose}
                            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl transition-all hover:rotate-90 relative z-10">
                            <Icon path={ICONS.close} size={18} />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

// ─── FormField ─────────────────────────────────────────────────────────────────
export function FormField({ label, name, type = 'text', value, onChange, required, placeholder, options }) {
    const inputClasses = "w-full bg-black/40 border border-white/15 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder-gray-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]";

    return (
        <div className="space-y-2 relative">
            <label className="block text-gray-400 text-[11px] font-bold uppercase tracking-widest pl-1">
                {label}{required && <span className="text-blue-500 ml-1 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">*</span>}
            </label>
            {options ? (
                <div className="relative">
                    <select name={name} value={value} onChange={onChange} required={required} className={`${inputClasses} appearance-none cursor-pointer`}>
                        <option value="">Select an option...</option>
                        {options.map(o => <option key={o.value} value={o.value} className="bg-gray-900 text-white p-2">{o.label}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
            ) : (
                <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className={inputClasses} />
            )}
        </div>
    );
}

// ─── Table ─────────────────────────────────────────────────────────────────────
export function Table({ columns, data, onEdit, onDelete, emptyMsg }) {
    if (!data.length) return (
        <div className="py-24 flex flex-col items-center justify-center gap-4 glass-panel rounded-3xl border-dashed">
            <div className="w-20 h-20 rounded-[2rem] bg-gray-900/50 border border-white/10 flex items-center justify-center text-gray-500 shadow-inner">
                <Icon path={ICONS.warning} size={32} />
            </div>
            <p className="text-gray-400 font-medium tracking-wide">{emptyMsg || 'No records found in the database.'}</p>
        </div>
    );
    
    return (
        <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-white/[0.03] border-b border-white/10">
                            {columns.map(c => (
                                <th key={c.key} className="text-left text-gray-400 font-bold py-5 px-6 text-[11px] uppercase tracking-[0.2em]">{c.label}</th>
                            ))}
                            {(onEdit || onDelete) && <th className="text-right text-gray-400 font-bold py-5 px-6 text-[11px] uppercase tracking-[0.2em]">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="group border-b border-white/5 hover:bg-blue-500/[0.03] transition-colors focus-within:bg-blue-500/[0.03]">
                                {columns.map(c => (
                                    <td key={c.key} className="py-4 px-6 text-gray-300 group-hover:text-white transition-colors">
                                        {c.render ? c.render(row) : (row[c.key] ?? '—')}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex gap-2 justify-end opacity-20 group-hover:opacity-100 transition-opacity">
                                            {onEdit && (
                                                <button onClick={() => onEdit(row)} title="Edit Record"
                                                    className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white shadow-lg transition-all hover:scale-110">
                                                    <Icon path={ICONS.edit} size={15} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button onClick={() => onDelete(row)} title="Delete Record"
                                                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white shadow-lg transition-all hover:scale-110">
                                                    <Icon path={ICONS.trash} size={15} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── SectionHeader ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, onAdd, addLabel }) {
    return (
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
                    {subtitle && <p className="text-gray-400 text-sm mt-1 font-medium tracking-wide">{subtitle}</p>}
                </div>
            </div>
            {onAdd && (
                <button onClick={onAdd}
                    className="glass-button flex items-center gap-2 px-6 py-3 text-white rounded-2xl text-[13px] font-bold tracking-wide uppercase transition-all shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.5)]"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                    <Icon path={ICONS.plus} size={16} />
                    {addLabel || 'Add New'}
                </button>
            )}
        </div>
    );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
export function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
    const isSuccess = type === 'success';
    
    return (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border"
                style={{ 
                    background: 'rgba(10,12,25,0.9)', 
                    borderColor: isSuccess ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                    boxShadow: isSuccess ? '0 20px 40px rgba(34,197,94,0.15)' : '0 20px 40px rgba(239,68,68,0.15)'
                }}>
                <div className="p-2 rounded-full shadow-inner" style={{ background: isSuccess ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)' }}>
                    <Icon path={isSuccess ? ICONS.check : ICONS.warning} size={18} className={isSuccess ? 'text-green-400' : 'text-red-400'} />
                </div>
                <span className="text-sm font-semibold tracking-wide text-white">{msg}</span>
                <button onClick={onClose} className="ml-2 text-gray-500 hover:text-white transition-colors">
                    <Icon path={ICONS.close} size={16} />
                </button>
            </div>
        </div>
    );
}
