import { useState, useEffect } from 'react';
import { invoiceAPI, employeeAPI, carAPI, customerAPI } from '../../utils/api';
import { ICONS, StatCard, Modal, FormField, Table, SectionHeader, Toast } from '../shared/UIComponents';

export default function InvoicesSection() {
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
