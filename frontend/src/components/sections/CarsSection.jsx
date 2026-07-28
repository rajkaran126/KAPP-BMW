import { useState, useEffect } from 'react';
import { carAPI } from '../../utils/api';
import { Icon, ICONS, Badge, StatCard, Modal, FormField, Table, SectionHeader, Toast } from '../shared/UIComponents';

export default function CarsSection() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ IL_No: '', Mod_No: '', Model: '', Colour: '', Year: '', status: 'available' });
    const [toast, setToast] = useState(null);

    const load = async () => {
        setLoading(true);
        try { 
            const r = await carAPI.getAll(); 
            const data = Array.isArray(r) ? r : (r?.data || []);
            setCars(data); 
        } catch (err) {
            console.error('Cars load error:', err);
        }
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
