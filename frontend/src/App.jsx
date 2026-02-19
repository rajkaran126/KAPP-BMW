import { useState, useEffect } from 'react';
import { carAPI, employeeAPI, customerAPI, invoiceAPI, reportsAPI, chatAPI } from './utils/api';
import './index.css';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ path, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
    </svg>
);

const ICONS = {
    car: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v5M16 17h2a2 2 0 002-2v-1M9 17a2 2 0 104 0 2 2 0 00-4 0M20 17a2 2 0 104 0 2 2 0 00-4 0",
    employee: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8",
    customer: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    invoice: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
    report: "M18 20V10M12 20V4M6 20v-6",
    chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
    plus: "M12 5v14M5 12h14",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    trash: "M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2",
    close: "M18 6L6 18M6 6l12 12",
    send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
    check: "M20 6L9 17l-5-5",
    warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
    refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
    user: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
};

// ─── Utility Components ───────────────────────────────────────────────────────
function Badge({ status }) {
    const colors = {
        available: 'bg-green-500/20 text-green-400 border border-green-500/30',
        sold: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>
            {status}
        </span>
    );
}

function StatCard({ label, value, icon, color = 'blue' }) {
    const textColors = { blue: '#60a5fa', green: '#4ade80', red: '#f87171', purple: '#c084fc' };
    const glowColors = { blue: 'rgba(28,105,212,0.15)', green: 'rgba(34,197,94,0.12)', red: 'rgba(239,68,68,0.12)', purple: 'rgba(168,85,247,0.12)' };
    const borderColors = { blue: 'rgba(28,105,212,0.25)', green: 'rgba(34,197,94,0.2)', red: 'rgba(239,68,68,0.2)', purple: 'rgba(168,85,247,0.2)' };
    return (
        <div className="p-5 flex items-center gap-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{
                background: `rgba(255,255,255,0.04)`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${borderColors[color]}`,
                boxShadow: `0 4px 24px ${glowColors[color]}`,
            }}>
            <div className="p-3 rounded-lg" style={{ background: glowColors[color], color: textColors[color] }}>
                <Icon path={icon} size={22} />
            </div>
            <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-white text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}

function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl"
                style={{
                    background: 'rgba(15,15,35,0.85)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                }}
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white text-lg font-bold">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                        <Icon path={ICONS.close} size={18} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', width: '100%', fontSize: '0.875rem', outline: 'none' };

function FormField({ label, name, type = 'text', value, onChange, required, placeholder, options }) {
    return (
        <div>
            <label className="block text-gray-400 text-sm mb-1">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
            {options ? (
                <select name={name} value={value} onChange={onChange} required={required} style={inputStyle}>
                    <option value="">Select...</option>
                    {options.map(o => <option key={o.value} value={o.value} style={{ background: '#1a1a2e' }}>{o.label}</option>)}
                </select>
            ) : (
                <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
                    style={inputStyle}
                    onFocus={e => e.target.style.border = '1px solid rgba(28,105,212,0.7)'}
                    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                    className="placeholder-gray-600" />
            )}
        </div>
    );
}

function Table({ columns, data, onEdit, onDelete, emptyMsg }) {
    if (!data.length) return (
        <div className="text-center py-16 text-gray-500">
            <p className="text-lg">{emptyMsg || 'No records found'}</p>
        </div>
    );
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/10">
                        {columns.map(c => (
                            <th key={c.key} className="text-left text-gray-400 font-medium py-3 px-4">{c.label}</th>
                        ))}
                        {(onEdit || onDelete) && <th className="text-right text-gray-400 font-medium py-3 px-4">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                            {columns.map(c => (
                                <td key={c.key} className="py-3 px-4 text-gray-300">
                                    {c.render ? c.render(row) : (row[c.key] ?? '—')}
                                </td>
                            ))}
                            {(onEdit || onDelete) && (
                                <td className="py-3 px-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        {onEdit && (
                                            <button onClick={() => onEdit(row)}
                                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                                                <Icon path={ICONS.edit} size={14} />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button onClick={() => onDelete(row)}
                                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
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

function SectionHeader({ title, subtitle, onAdd, addLabel }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
            </div>
            {onAdd && (
                <button onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    <Icon path={ICONS.plus} size={16} />
                    {addLabel || 'Add New'}
                </button>
            )}
        </div>
    );
}

function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
    const colors = { success: 'bg-green-600', error: 'bg-red-600' };
    return (
        <div className={`fixed bottom-6 right-6 z-[100] ${colors[type] || 'bg-gray-700'} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium`}>
            <Icon path={type === 'success' ? ICONS.check : ICONS.warning} size={16} />
            {msg}
        </div>
    );
}

// ─── Cars Section ─────────────────────────────────────────────────────────────
function CarsSection() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'add' | 'edit'
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ IL_No: '', Mod_No: '', Model: '', Colour: '', Year: '', status: 'available' });
    const [toast, setToast] = useState(null);

    const load = async () => {
        setLoading(true);
        try { const r = await carAPI.getAll(); setCars(r.data); } catch { }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm({ IL_No: '', Mod_No: '', Model: '', Colour: '', Year: '', status: 'available' }); setModal('add'); };
    const openEdit = (car) => { setSelected(car); setForm({ IL_No: car.IL_No || '', Mod_No: car.Mod_No || '', Model: car.Model || '', Colour: car.Colour || '', Year: car.Year || '', status: car.status || 'available' }); setModal('edit'); };
    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (modal === 'add') await carAPI.create(form);
            else await carAPI.update(selected.Car_ID, form);
            setToast({ msg: `Car ${modal === 'add' ? 'added' : 'updated'} successfully!`, type: 'success' });
            setModal(null); load();
        } catch (err) { setToast({ msg: err.response?.data?.error || 'Error saving car', type: 'error' }); }
    };

    const handleDelete = async car => {
        if (!confirm(`Delete ${car.Model}?`)) return;
        try { await carAPI.delete(car.Car_ID); setToast({ msg: 'Car deleted', type: 'success' }); load(); }
        catch (err) { setToast({ msg: err.response?.data?.error || 'Error deleting car', type: 'error' }); }
    };

    const available = cars.filter(c => c.status === 'available').length;
    const sold = cars.filter(c => c.status === 'sold').length;

    return (
        <div>
            <SectionHeader title="Cars Inventory" subtitle="Manage your BMW fleet" onAdd={openAdd} addLabel="Add Car" />
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Cars" value={cars.length} icon={ICONS.car} color="blue" />
                <StatCard label="Available" value={available} icon={ICONS.check} color="green" />
                <StatCard label="Sold" value={sold} icon={ICONS.invoice} color="red" />
            </div>
            <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
                    <Table
                        columns={[
                            { key: 'Car_ID', label: 'ID' },
                            { key: 'Model', label: 'Model' },
                            { key: 'Colour', label: 'Colour' },
                            { key: 'Year', label: 'Year' },
                            { key: 'IL_No', label: 'IL No.' },
                            { key: 'Mod_No', label: 'Mod No.' },
                            { key: 'status', label: 'Status', render: r => <Badge status={r.status} /> },
                        ]}
                        data={cars} onEdit={openEdit} onDelete={handleDelete} emptyMsg="No cars in inventory. Add your first car!" />
                )}
            </div>
            {modal && (
                <Modal title={modal === 'add' ? 'Add New Car' : 'Edit Car'} onClose={() => setModal(null)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField label="Model" name="Model" value={form.Model} onChange={handleChange} required placeholder="e.g. BMW X5" />
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Colour" name="Colour" value={form.Colour} onChange={handleChange} placeholder="e.g. Alpine White" />
                            <FormField label="Year" name="Year" type="number" value={form.Year} onChange={handleChange} placeholder="e.g. 2025" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="IL No. (Insurance/License)" name="IL_No" value={form.IL_No} onChange={handleChange} placeholder="e.g. IL-X5-001" />
                            <FormField label="Mod No." name="Mod_No" value={form.Mod_No} onChange={handleChange} placeholder="e.g. X5-2025" />
                        </div>
                        <FormField label="Status" name="status" value={form.status} onChange={handleChange}
                            options={[{ value: 'available', label: 'Available' }, { value: 'sold', label: 'Sold' }]} />
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setModal(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                                {modal === 'add' ? 'Add Car' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

// ─── Employees Section ────────────────────────────────────────────────────────
function EmployeesSection() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ Name: '', Address: '', qualifications: '' });
    const [toast, setToast] = useState(null);

    const load = async () => {
        setLoading(true);
        try { const r = await employeeAPI.getAll(); setEmployees(r.data); } catch { }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm({ Name: '', Address: '', qualifications: '' }); setModal('add'); };
    const openEdit = emp => {
        setSelected(emp);
        const quals = emp.EmployeeQualifications?.map(q => q.qualification).join(', ') || '';
        setForm({ Name: emp.Name || '', Address: emp.Address || '', qualifications: quals });
        setModal('edit');
    };
    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        const payload = {
            Name: form.Name,
            Address: form.Address,
            qualifications: form.qualifications.split(',').map(q => q.trim()).filter(Boolean)
        };
        try {
            if (modal === 'add') await employeeAPI.create(payload);
            else await employeeAPI.update(selected.EmpID, payload);
            setToast({ msg: `Employee ${modal === 'add' ? 'added' : 'updated'}!`, type: 'success' });
            setModal(null); load();
        } catch (err) { setToast({ msg: err.response?.data?.error || 'Error saving employee', type: 'error' }); }
    };

    const handleDelete = async emp => {
        if (!confirm(`Delete ${emp.Name}?`)) return;
        try { await employeeAPI.delete(emp.EmpID); setToast({ msg: 'Employee deleted', type: 'success' }); load(); }
        catch (err) { setToast({ msg: err.response?.data?.error || 'Cannot delete: employee has invoices', type: 'error' }); }
    };

    return (
        <div>
            <SectionHeader title="Employees" subtitle="Sales staff management" onAdd={openAdd} addLabel="Add Employee" />
            <div className="grid grid-cols-2 gap-4 mb-6">
                <StatCard label="Total Employees" value={employees.length} icon={ICONS.employee} color="purple" />
                <StatCard label="Active Staff" value={employees.length} icon={ICONS.check} color="green" />
            </div>
            <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
                    <Table
                        columns={[
                            { key: 'EmpID', label: 'ID' },
                            { key: 'Name', label: 'Name' },
                            { key: 'Address', label: 'Address' },
                            {
                                key: 'qualifications', label: 'Qualifications', render: r => (
                                    <div className="flex flex-wrap gap-1">
                                        {r.EmployeeQualifications?.length ? r.EmployeeQualifications.map((q, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">{q.qualification}</span>
                                        )) : <span className="text-gray-500">—</span>}
                                    </div>
                                )
                            },
                        ]}
                        data={employees} onEdit={openEdit} onDelete={handleDelete} emptyMsg="No employees found. Add your first employee!" />
                )}
            </div>
            {modal && (
                <Modal title={modal === 'add' ? 'Add Employee' : 'Edit Employee'} onClose={() => setModal(null)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField label="Name" name="Name" value={form.Name} onChange={handleChange} required placeholder="Full name" />
                        <FormField label="Address" name="Address" value={form.Address} onChange={handleChange} placeholder="Address" />
                        <FormField label="Qualifications (comma-separated)" name="qualifications" value={form.qualifications} onChange={handleChange} placeholder="e.g. MBA, Sales Expert, BMW Certified" />
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setModal(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                                {modal === 'add' ? 'Add Employee' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

// ─── Customers Section ────────────────────────────────────────────────────────
function CustomersSection() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ Name: '', Ph_No: '', Address: '', City: '', Country: '' });
    const [toast, setToast] = useState(null);

    const load = async () => {
        setLoading(true);
        try { const r = await customerAPI.getAll(); setCustomers(r.data); } catch { }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm({ Name: '', Ph_No: '', Address: '', City: '', Country: '' }); setModal('add'); };
    const openEdit = c => { setSelected(c); setForm({ Name: c.Name || '', Ph_No: c.Ph_No || '', Address: c.Address || '', City: c.City || '', Country: c.Country || '' }); setModal('edit'); };
    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (modal === 'add') await customerAPI.create(form);
            else await customerAPI.update(selected.Cus_ID, form);
            setToast({ msg: `Customer ${modal === 'add' ? 'added' : 'updated'}!`, type: 'success' });
            setModal(null); load();
        } catch (err) { setToast({ msg: err.response?.data?.error || 'Error saving customer', type: 'error' }); }
    };

    const handleDelete = async c => {
        if (!confirm(`Delete ${c.Name}?`)) return;
        try { await customerAPI.delete(c.Cus_ID); setToast({ msg: 'Customer deleted', type: 'success' }); load(); }
        catch (err) { setToast({ msg: err.response?.data?.error || 'Error deleting customer', type: 'error' }); }
    };

    return (
        <div>
            <SectionHeader title="Customers" subtitle="Customer database" onAdd={openAdd} addLabel="Add Customer" />
            <div className="grid grid-cols-2 gap-4 mb-6">
                <StatCard label="Total Customers" value={customers.length} icon={ICONS.customer} color="blue" />
                <StatCard label="Cities" value={[...new Set(customers.map(c => c.City).filter(Boolean))].length} icon={ICONS.report} color="purple" />
            </div>
            <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
                    <Table
                        columns={[
                            { key: 'Cus_ID', label: 'ID' },
                            { key: 'Name', label: 'Name' },
                            { key: 'Ph_No', label: 'Phone' },
                            { key: 'City', label: 'City' },
                            { key: 'Country', label: 'Country' },
                            { key: 'Address', label: 'Address' },
                        ]}
                        data={customers} onEdit={openEdit} onDelete={handleDelete} emptyMsg="No customers yet. Add your first customer!" />
                )}
            </div>
            {modal && (
                <Modal title={modal === 'add' ? 'Add Customer' : 'Edit Customer'} onClose={() => setModal(null)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField label="Name" name="Name" value={form.Name} onChange={handleChange} required placeholder="Customer full name" />
                        <FormField label="Phone Number" name="Ph_No" value={form.Ph_No} onChange={handleChange} placeholder="+91 98765 43210" />
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="City" name="City" value={form.City} onChange={handleChange} placeholder="Mumbai" />
                            <FormField label="Country" name="Country" value={form.Country} onChange={handleChange} placeholder="India" />
                        </div>
                        <FormField label="Address" name="Address" value={form.Address} onChange={handleChange} placeholder="Full address" />
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setModal(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                                {modal === 'add' ? 'Add Customer' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

// ─── Invoices Section ─────────────────────────────────────────────────────────
function InvoicesSection() {
    const [invoices, setInvoices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [cars, setCars] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ Date: '', amount: '', EmpID: '', Car_ID: '', Cus_ID: '' });
    const [toast, setToast] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const [inv, emp, car, cust] = await Promise.all([
                invoiceAPI.getAll(), employeeAPI.getAll(),
                carAPI.getAll(), customerAPI.getAll()
            ]);
            setInvoices(inv.data); setEmployees(emp.data);
            setCars(car.data); setCustomers(cust.data);
        } catch { }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await invoiceAPI.create(form);
            setToast({ msg: 'Invoice created! Car marked as sold.', type: 'success' });
            setModal(false); load();
        } catch (err) { setToast({ msg: err.response?.data?.error || 'Error creating invoice', type: 'error' }); }
    };

    const handleDelete = async inv => {
        if (!confirm(`Delete Invoice #${inv.Invoice_ID}?`)) return;
        try { await invoiceAPI.delete(inv.Invoice_ID); setToast({ msg: 'Invoice deleted. Car reverted to available.', type: 'success' }); load(); }
        catch (err) { setToast({ msg: err.response?.data?.error || 'Error deleting invoice', type: 'error' }); }
    };

    const availableCars = cars.filter(c => c.status === 'available');
    const totalRevenue = invoices.reduce((s, i) => s + parseFloat(i.amount || 0), 0);

    return (
        <div>
            <SectionHeader title="Sales Invoices" subtitle="Sales transactions" onAdd={() => { setForm({ Date: new Date().toISOString().split('T')[0], amount: '', EmpID: '', Car_ID: '', Cus_ID: '' }); setModal(true); }} addLabel="New Invoice" />
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Invoices" value={invoices.length} icon={ICONS.invoice} color="blue" />
                <StatCard label="Total Revenue" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} icon={ICONS.report} color="green" />
                <StatCard label="Cars Sold" value={invoices.length} icon={ICONS.car} color="red" />
            </div>
            <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
                    <Table
                        columns={[
                            { key: 'Invoice_ID', label: 'Invoice #' },
                            { key: 'Date', label: 'Date' },
                            { key: 'amount', label: 'Amount', render: r => r.amount ? `₹${parseFloat(r.amount).toLocaleString('en-IN')}` : '—' },
                            { key: 'employee', label: 'Employee', render: r => r.employee?.Name || r.EmpID },
                            { key: 'car', label: 'Car', render: r => r.car?.Model || r.Car_ID },
                            { key: 'customer', label: 'Customer', render: r => r.customer?.Name || r.Cus_ID },
                        ]}
                        data={invoices} onDelete={handleDelete} emptyMsg="No invoices yet. Create your first sale!" />
                )}
            </div>
            {modal && (
                <Modal title="Create New Invoice" onClose={() => setModal(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField label="Date" name="Date" type="date" value={form.Date} onChange={handleChange} required />
                        <FormField label="Sale Amount (₹)" name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="e.g. 9500000" />
                        <FormField label="Employee (Salesperson)" name="EmpID" value={form.EmpID} onChange={handleChange} required
                            options={employees.map(e => ({ value: e.EmpID, label: `${e.Name} (ID: ${e.EmpID})` }))} />
                        <FormField label="Car (Available Only)" name="Car_ID" value={form.Car_ID} onChange={handleChange} required
                            options={availableCars.map(c => ({ value: c.Car_ID, label: `${c.Model} ${c.Year || ''} - ${c.Colour || ''} (ID: ${c.Car_ID})` }))} />
                        <FormField label="Customer" name="Cus_ID" value={form.Cus_ID} onChange={handleChange} required
                            options={customers.map(c => ({ value: c.Cus_ID, label: `${c.Name} (ID: ${c.Cus_ID})` }))} />
                        <p className="text-xs text-yellow-400/80 bg-yellow-400/10 rounded-lg px-3 py-2">
                            ⚡ Creating an invoice will automatically mark the car as <strong>sold</strong> via database trigger.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">Create Invoice</button>
                        </div>
                    </form>
                </Modal>
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

// ─── Reports Section ──────────────────────────────────────────────────────────
function ReportsSection() {
    const [salesReport, setSalesReport] = useState([]);
    const [availableCars, setAvailableCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeReport, setActiveReport] = useState('sales');
    const [toast, setToast] = useState(null);

    const loadReport = async (type) => {
        setLoading(true);
        setActiveReport(type);
        try {
            if (type === 'sales') { const r = await reportsAPI.getSalesReport(); setSalesReport(r.data); }
            else { const r = await reportsAPI.getAvailableCarsSummary(); setAvailableCars(r.data); }
        } catch (err) { setToast({ msg: 'Error loading report: ' + (err.response?.data?.error || err.message), type: 'error' }); }
        setLoading(false);
    };

    useEffect(() => { loadReport('sales'); }, []);

    return (
        <div>
            <SectionHeader title="Reports & Analytics" subtitle="Cursor-based stored procedure reports" />
            <div className="flex gap-3 mb-6">
                {[
                    { key: 'sales', label: 'Employee Sales Report', desc: 'GenerateEmployeeSalesReport()' },
                    { key: 'cars', label: 'Available Cars Summary', desc: 'GetAvailableCarsSummary()' },
                ].map(r => (
                    <button key={r.key} onClick={() => loadReport(r.key)}
                        className={`flex-1 p-4 rounded-xl border border-white text-left transition-all ${activeReport === r.key ? 'bg-white/10' : 'bg-white/3 hover:bg-white/5'}`}>
                        <p className="text-white font-semibold text-sm">{r.label}</p>
                        <p className="text-gray-500 text-xs mt-1 font-mono">{r.desc}</p>
                    </button>
                ))}
                <button onClick={() => loadReport(activeReport)}
                    className="p-4 rounded-xl border border-white/10 bg-white/3 hover:border-white/20 text-gray-400 hover:text-white transition-all">
                    <Icon path={ICONS.refresh} size={18} />
                </button>
            </div>

            <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {loading ? <div className="text-center py-12 text-gray-400">Running cursor procedure...</div> : (
                    activeReport === 'sales' ? (
                        <Table
                            columns={[
                                { key: 'EmpID', label: 'Emp ID' },
                                { key: 'EmployeeName', label: 'Employee' },
                                { key: 'total_invoices', label: 'Invoices' },
                                { key: 'total_amount', label: 'Total Sales', render: r => `₹${parseFloat(r.total_amount || 0).toLocaleString('en-IN')}` },
                                { key: 'cars_sold', label: 'Cars Sold' },
                            ]}
                            data={salesReport} emptyMsg="No sales data. Add employees and create invoices first." />
                    ) : (
                        <Table
                            columns={[
                                { key: 'Car_ID', label: 'Car ID' },
                                { key: 'Model', label: 'Model' },
                                { key: 'Colour', label: 'Colour' },
                                { key: 'Year', label: 'Year' },
                                { key: 'IL_No', label: 'IL No.' },
                                { key: 'seller_count', label: 'Sellers Associated' },
                            ]}
                            data={availableCars} emptyMsg="No available cars found." />
                    )
                )}
            </div>
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

// ─── Chat Section ─────────────────────────────────────────────────────────────
function ChatSection({ user }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello ${user?.name || 'there'}! I'm your BMW AI Sales Assistant. I'm connected to your local database and ready to help you manage cars, sales, and staff.` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = { current: null };

    const send = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: 'user', content: input };
        const history = [...messages, userMsg];
        setMessages(history);
        setInput('');
        setLoading(true);
        try {
            // Pass user object to API
            const r = await chatAPI.sendMessage(input, messages, user);
            setMessages([...history, { role: 'assistant', content: r.data.reply }]);
        } catch {
            setMessages([...history, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-160px)]">
            <SectionHeader title="AI Sales Assistant" subtitle="Powered by Google Gemini 2.0 Flash" />
            <div className="flex-1 bg-white/3 border border-white/10 rounded-xl overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white/8 text-gray-200 rounded-bl-sm border border-white/10'
                                }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/8 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="border-t border-white/10 p-4 flex gap-3">
                    <input
                        value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder={`Ask anything, ${user?.name?.split(' ')[0] || 'User'}...`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-600"
                    />
                    <button onClick={send} disabled={loading || !input.trim()}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-colors">
                        <Icon path={ICONS.send} size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Profile Section ──────────────────────────────────────────────────────────
function ProfileSection({ user, onUpdateUser }) {
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            onUpdateUser({ avatar: reader.result });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <SectionHeader title="My Profile" subtitle="Manage your account" />
            <div className="flex gap-8 items-start">
                {/* Avatar Card */}
                <div className="p-8 rounded-2xl flex flex-col items-center gap-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500/30 bg-gray-800 relative shadow-2xl">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900/50">
                                <Icon path={ICONS.user} size={64} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <label className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20">
                            <Icon path={ICONS.edit} size={16} />
                            Upload Photo
                            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                        </label>
                        {user.avatar && (
                            <button onClick={() => onUpdateUser({ avatar: null })}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold transition-colors border border-red-500/20">
                                <Icon path={ICONS.trash} size={16} />
                                Remove Photo
                            </button>
                        )}
                    </div>
                </div>

                {/* Details Card */}
                <div className="flex-1 p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Icon path={ICONS.user} size={20} /></div>
                        Account Details
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                            <input
                                value={user.name}
                                onChange={e => onUpdateUser({ name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Role</label>
                            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium cursor-not-allowed opacity-70">
                                {user.role}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Username</label>
                            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-medium cursor-not-allowed opacity-70">
                                {user.username}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-sm text-gray-500">
                            Member since <span className="text-gray-300">February 2026</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────
function DashboardSection({ setTab }) {
    const [stats, setStats] = useState({ cars: 0, employees: 0, customers: 0, invoices: 0, revenue: 0, available: 0 });
    useEffect(() => {
        Promise.all([carAPI.getAll(), employeeAPI.getAll(), customerAPI.getAll(), invoiceAPI.getAll()])
            .then(([c, e, cu, i]) => {
                const cars = c.data; const invoices = i.data;
                setStats({
                    cars: cars.length, employees: e.data.length, customers: cu.data.length,
                    invoices: invoices.length, available: cars.filter(x => x.status === 'available').length,
                    revenue: invoices.reduce((s, x) => s + parseFloat(x.amount || 0), 0)
                });
            }).catch(() => { });
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-1">Dashboard</h2>
                <p className="text-gray-400">KAPP-BMW Sales Management System</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <StatCard label="Total Cars" value={stats.cars} icon={ICONS.car} color="blue" />
                <StatCard label="Available" value={stats.available} icon={ICONS.check} color="green" />
                <StatCard label="Employees" value={stats.employees} icon={ICONS.employee} color="purple" />
                <StatCard label="Customers" value={stats.customers} icon={ICONS.customer} color="blue" />
                <StatCard label="Invoices" value={stats.invoices} icon={ICONS.invoice} color="red" />
                <StatCard label="Revenue" value={`₹${(stats.revenue / 100000).toFixed(1)}L`} icon={ICONS.report} color="green" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { tab: 'cars', icon: ICONS.car, label: 'Manage Cars', desc: 'Add, edit, view inventory', color: 'blue' },
                    { tab: 'employees', icon: ICONS.employee, label: 'Manage Employees', desc: 'Staff & qualifications', color: 'purple' },
                    { tab: 'customers', icon: ICONS.customer, label: 'Manage Customers', desc: 'Customer database', color: 'blue' },
                    { tab: 'invoices', icon: ICONS.invoice, label: 'Sales Invoices', desc: 'Create & view sales', color: 'red' },
                    { tab: 'reports', icon: ICONS.report, label: 'Reports', desc: 'Cursor-based analytics', color: 'green' },
                    { tab: 'chat', icon: ICONS.chat, label: 'AI Assistant', desc: 'Gemini-powered chat', color: 'blue' },
                ].map(item => (
                    <button key={item.tab} onClick={() => setTab(item.tab)}
                        className="p-5 bg-white/3 border border-white/10 rounded-xl hover:border-blue-500/40 hover:bg-blue-500/5 transition-all text-left group">
                        <div className="text-blue-400 mb-3 group-hover:scale-110 transition-transform inline-block">
                            <Icon path={item.icon} size={24} />
                        </div>
                        <p className="text-white font-semibold">{item.label}</p>
                        <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: ICONS.report },
    { key: 'cars', label: 'Cars', icon: ICONS.car },
    { key: 'employees', label: 'Employees', icon: ICONS.employee },
    { key: 'customers', label: 'Customers', icon: ICONS.customer },
    { key: 'invoices', label: 'Invoices', icon: ICONS.invoice },
    { key: 'reports', label: 'Reports', icon: ICONS.report },
    { key: 'chat', label: 'AI Chat', icon: ICONS.chat },
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
        chat: <ChatSection user={user} />,
        profile: <ProfileSection user={user} onUpdateUser={onUpdateUser} />,
    };

    return (
        <div className="flex h-screen text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #060614 0%, #0a0a18 100%)' }}>
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(28,105,212,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(13,71,161,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            </div>
            {/* Sidebar */}
            <aside className="w-60 flex flex-col shrink-0 relative z-10" style={{ background: 'rgba(10,10,24,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Logo */}
                <div className="px-5 py-6 border-b border-white/8">
                    <div className="flex items-center gap-3">
                        <img src="/images/bmw-logo.png" alt="BMW" className="h-9 w-auto" onError={e => e.target.style.display = 'none'} />
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">KAPP-BMW</p>
                            <p className="text-gray-500 text-xs">Sales Management</p>
                        </div>
                    </div>
                </div>
                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map(item => (
                        <button key={item.key} onClick={() => setTab(item.key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === item.key
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}>
                            <Icon path={item.icon} size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                {/* Footer */}
                <div className="px-5 py-4 border-t border-white/8 space-y-3">
                    {user && (
                        <div className="flex items-center gap-3 px-1 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border border-white/10 shrink-0">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Icon path={ICONS.user} size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                                <p className="text-blue-400 text-xs truncate">{user.role}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-2">
                        {onBackHome && (
                            <button onClick={onBackHome} className="flex-1 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors">
                                Home
                            </button>
                        )}
                        {onLogout && (
                            <button onClick={onLogout} className="flex-1 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-colors">
                                Logout
                            </button>
                        )}
                    </div>
                    <p className="text-gray-700 text-xs">KAPP-BMW © 2026</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto px-8 py-8">
                    {SECTIONS[tab]}
                </div>
            </main>
        </div>
    );
}

export default App;
