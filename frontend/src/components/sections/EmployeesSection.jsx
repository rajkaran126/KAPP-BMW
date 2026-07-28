import { useState, useEffect } from 'react';
import { employeeAPI } from '../../utils/api';
import { ICONS, StatCard, Modal, FormField, Table, SectionHeader, Toast } from '../shared/UIComponents';

export default function EmployeesSection() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ Name: '', Address: '', designation: '' });
    const [toast, setToast] = useState(null);

    const load = async () => {
        setLoading(true);
        try { 
            const r = await employeeAPI.getAll(); 
            const data = Array.isArray(r) ? r : (r?.data || []);
            setEmployees(data); 
        } catch (err) {
            console.error('Employees load error:', err);
        }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm({ Name: '', Address: '', designation: '' }); setModal('add'); };
    const openEdit = emp => {
        setSelected(emp);
        setForm({ Name: emp.Name || '', Address: emp.Address || '', designation: emp.designation || '' });
        setModal('edit');
    };
    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        const payload = { Name: form.Name, Address: form.Address, designation: form.designation };
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
                                key: 'designation', label: 'Designation', render: r => (
                                    r.designation
                                        ? <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">{r.designation}</span>
                                        : <span className="text-gray-500">—</span>
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
                        <FormField label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Sales Manager, Senior Executive" />
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
