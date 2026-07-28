import { useState, useEffect } from 'react';
import { customerAPI } from '../../utils/api';
import { ICONS, StatCard, Modal, FormField, Table, SectionHeader, Toast } from '../shared/UIComponents';

export default function CustomersSection() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ Name: '', Ph_No: '', Address: '', City: '', Country: '' });
    const [toast, setToast] = useState(null);

    const load = async () => {
        setLoading(true);
        try { 
            const r = await customerAPI.getAll(); 
            const data = Array.isArray(r) ? r : (r?.data || []);
            setCustomers(data); 
        } catch (err) {
            console.error('Customers load error:', err);
        }
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
