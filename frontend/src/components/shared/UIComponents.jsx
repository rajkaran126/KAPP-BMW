import { useEffect } from 'react';

// ─── Icon ──────────────────────────────────────────────────────────────────────
export const Icon = ({ path, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    const styles = {
        available: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.35)', color: '#4ade80' },
        sold: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.35)', color: '#f87171' },
    };
    const s = styles[status] || { bg: 'rgba(107,114,128,0.15)', border: 'rgba(107,114,128,0.3)', color: '#9ca3af' };
    return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide"
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
            {status}
        </span>
    );
}

// ─── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = 'blue' }) {
    const textColors = { blue: '#60a5fa', green: '#4ade80', red: '#f87171', purple: '#c084fc' };
    const glowColors = { blue: 'rgba(28,105,212,0.15)', green: 'rgba(34,197,94,0.12)', red: 'rgba(239,68,68,0.12)', purple: 'rgba(168,85,247,0.12)' };
    const borderColors = { blue: 'rgba(28,105,212,0.25)', green: 'rgba(34,197,94,0.2)', red: 'rgba(239,68,68,0.2)', purple: 'rgba(168,85,247,0.2)' };
    return (
        <div className="p-5 flex items-center gap-4 rounded-xl transition-all duration-300 hover:scale-[1.03] group cursor-default"
            style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${borderColors[color]}`,
                boxShadow: `0 4px 24px ${glowColors[color]}`,
            }}>
            <div className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                style={{
                    background: `linear-gradient(135deg, ${glowColors[color]}, rgba(255,255,255,0.03))`,
                    color: textColors[color],
                    border: `1px solid ${borderColors[color]}`,
                }}>
                <Icon path={icon} size={22} />
            </div>
            <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">{label}</p>
                <p className="text-white text-2xl font-bold mt-0.5" style={{ lineHeight: 1.15 }}>{value}</p>
            </div>
        </div>
    );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            <div className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl overflow-hidden"
                style={{
                    background: 'rgba(12,12,30,0.97)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
                }}
                onClick={e => e.stopPropagation()}>
                {/* Gradient top accent bar */}
                <div style={{ height: '2px', background: 'linear-gradient(to right, #1c69d4, #3b82f6, rgba(96,165,250,0.2))' }} />
                <div className="p-6">
                    <div className="flex items-center justify-between mb-5 pb-4"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <h3 className="text-white text-lg font-bold">{title}</h3>
                        <button onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/8">
                            <Icon path={ICONS.close} size={16} />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

// ─── Input Style ───────────────────────────────────────────────────────────────
export const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: '0.625rem',
    padding: '0.625rem 0.875rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.15s',
};

// ─── FormField ─────────────────────────────────────────────────────────────────
export function FormField({ label, name, type = 'text', value, onChange, required, placeholder, options }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide">
                {label}{required && <span className="text-blue-400 ml-1">*</span>}
            </label>
            {options ? (
                <select name={name} value={value} onChange={onChange} required={required} style={inputStyle}>
                    <option value="">Select...</option>
                    {options.map(o => <option key={o.value} value={o.value} style={{ background: '#0c0c1e' }}>{o.label}</option>)}
                </select>
            ) : (
                <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
                    style={inputStyle}
                    onFocus={e => e.target.style.border = '1px solid rgba(59,130,246,0.7)'}
                    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                    className="placeholder-gray-600" />
            )}
        </div>
    );
}

// ─── Table ─────────────────────────────────────────────────────────────────────
export function Table({ columns, data, onEdit, onDelete, emptyMsg }) {
    if (!data.length) return (
        <div className="text-center py-20 flex flex-col items-center gap-3 text-gray-500">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Icon path={ICONS.warning} size={24} />
            </div>
            <p className="text-sm">{emptyMsg || 'No records found'}</p>
        </div>
    );
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {columns.map(c => (
                            <th key={c.key} className="text-left text-gray-500 font-semibold py-3 px-4 text-xs uppercase tracking-widest">{c.label}</th>
                        ))}
                        {(onEdit || onDelete) && <th className="text-right text-gray-500 font-semibold py-3 px-4 text-xs uppercase tracking-widest">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/4 transition-colors duration-150"
                            style={{ background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                            {columns.map(c => (
                                <td key={c.key} className="py-3.5 px-4 text-gray-300">
                                    {c.render ? c.render(row) : (row[c.key] ?? '—')}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="py-3.5 px-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        {onEdit && (
                                            <button onClick={() => onEdit(row)} title="Edit"
                                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/25 hover:text-blue-300 transition-all">
                                                <Icon path={ICONS.edit} size={14} />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button onClick={() => onDelete(row)} title="Delete"
                                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/25 hover:text-red-300 transition-all">
                                                <Icon path={ICONS.trash} size={14} />
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
    );
}

// ─── SectionHeader ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, onAdd, addLabel }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-start gap-3">
                <div className="w-1 h-8 rounded-full mt-0.5 shrink-0"
                    style={{ background: 'linear-gradient(to bottom, #60a5fa, rgba(28,105,212,0.15))' }} />
                <div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    {subtitle && <p className="text-gray-400 text-sm mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {onAdd && (
                <button onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.03] active:scale-[0.98]"
                    style={{
                        background: 'linear-gradient(135deg, #1c69d4, #0d47a1)',
                        boxShadow: '0 4px 16px rgba(28,105,212,0.35)',
                    }}>
                    <Icon path={ICONS.plus} size={16} />
                    {addLabel || 'Add New'}
                </button>
            )}
        </div>
    );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
export function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    const accent = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#6b7280';
    return (
        <div className="fixed bottom-6 right-6 z-[100] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium"
            style={{
                background: 'rgba(12,12,30,0.96)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: `3px solid ${accent}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
            <div style={{ color: accent }}>
                <Icon path={type === 'success' ? ICONS.check : ICONS.warning} size={16} />
            </div>
            <span>{msg}</span>
        </div>
    );
}
