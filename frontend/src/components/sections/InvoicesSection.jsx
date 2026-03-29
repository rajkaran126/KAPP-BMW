import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Table, SectionHeader, Modal, FormField, Toast, StatCard, ICONS } from '../shared/UIComponents';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function InvoicesSection() {
    const [invoices, setInvoices] = useState([]);
    const [cars, setCars] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ car_id: '', employee_id: '', customer_id: '', sale_price: '', sale_date: new Date().toISOString().split('T')[0] });
    const [toast, setToast] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [invRes, carRes, empRes, cusRes] = await Promise.all([
                api.getInvoices(), api.getCars(), api.getEmployees(), api.getCustomers()
            ]);
            setInvoices(invRes || []);
            setCars((carRes || []).filter(c => c.status === 'available'));
            setEmployees(empRes || []);
            setCustomers(cusRes || []);
        } catch (err) {
            setToast({ type: 'error', msg: 'Failed to load data' });
        }
        setLoading(false);
    };

    const handleFormChange = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleDownload = (invoice) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(5, 5, 15);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('KAPP-BMW', 14, 25);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('SALES INVOICE', 160, 25);

        // Details
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(12);
        let y = 60;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice Details', 14, y);
        doc.setFont('helvetica', 'normal');
        y += 10;
        doc.text(`Invoice ID: #${invoice.id}`, 14, y); y += 8;
        doc.text(`Date: ${new Date(invoice.sale_date).toLocaleDateString()}`, 14, y); y += 8;
        doc.text(`Amount: $${Number(invoice.sale_price).toLocaleString()}`, 14, y); y += 15;

        // Entities
        doc.autoTable({
            startY: y,
            head: [['Vehicle', 'Sales Representative', 'Customer']],
            body: [[
                invoice.Car ? `${invoice.Car.make} ${invoice.Car.model} (${invoice.Car.year})` : 'N/A',
                invoice.Employee ? invoice.Employee.name : 'N/A',
                invoice.Customer ? invoice.Customer.name : 'N/A'
            ]],
            headStyles: { fillColor: [59, 130, 246] },
            theme: 'grid'
        });

        doc.save(`KAPP_BMW_Invoice_${invoice.id}.pdf`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createInvoice(formData);
            setToast({ type: 'success', msg: 'Invoice created successfully! Car marked as sold.' });
            setIsAddOpen(false);
            setFormData({ car_id: '', employee_id: '', customer_id: '', sale_price: '', sale_date: new Date().toISOString().split('T')[0] });
            loadData();
        } catch (err) {
            setToast({ type: 'error', msg: err.response?.data?.error || 'Failed to create invoice' });
        }
    };

    const handleDelete = async (invoice) => {
        if (!confirm(`Delete Invoice #${invoice.id}?`)) return;
        try { 
            await api.deleteInvoice(invoice.id); 
            setToast({ msg: 'Invoice deleted. Car reverted to available.', type: 'success' }); 
            loadData(); 
        } catch (err) { 
            setToast({ msg: err.response?.data?.error || 'Error deleting invoice', type: 'error' }); 
        }
    };

    const totalRevenue = invoices.reduce((s, i) => s + parseFloat(i.sale_price || 0), 0);

    return (
        <div>
            <SectionHeader title="Sales Invoices" subtitle="Sales transactions" onAdd={() => { setFormData({ car_id: '', employee_id: '', customer_id: '', sale_price: '', sale_date: new Date().toISOString().split('T')[0] }); setIsAddOpen(true); }} addLabel="New Invoice" />
            
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Invoices" value={invoices.length} icon={ICONS.invoice} color="blue" />
                <StatCard label="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(1)}K`} icon={ICONS.report} color="green" />
                <StatCard label="Cars Sold" value={invoices.length} icon={ICONS.car} color="red" />
            </div>

            <div className="rounded-[2rem]">
                {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
                    <Table
                        columns={[
                            { key: 'id', label: 'ID', render: r => <span className="text-gray-500 font-mono">#{r.id}</span> },
                            { key: 'car', label: 'Vehicle', render: r => r.Car ? <span className="font-medium text-white">{r.Car.make} {r.Car.model}</span> : <span className="text-gray-500">Deleted</span> },
                            { key: 'price', label: 'Amount', render: r => <span className="text-green-400 font-bold">${Number(r.sale_price).toLocaleString()}</span> },
                            { key: 'customer', label: 'Customer', render: r => r.Customer ? r.Customer.name : 'N/A' },
                            { key: 'employee', label: 'Rep', render: r => r.Employee ? r.Employee.name : 'N/A' },
                            { key: 'date', label: 'Date', render: r => new Date(r.sale_date).toLocaleDateString() },
                            { key: 'actions', label: '', render: r => (
                                <button onClick={(e) => { e.stopPropagation(); handleDownload(r); }} 
                                    className="p-2 shrink-0 flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-lg hover:scale-110 ml-auto"
                                    title="Download PDF">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline px-1">PDF</span>
                                </button>
                            )}
                        ]}
                        data={invoices} onDelete={handleDelete} emptyMsg="No invoices yet. Create your first sale!" />
                )}
            </div>

            {isAddOpen && (
                <Modal title="Create New Invoice" onClose={() => setIsAddOpen(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField label="Date" name="sale_date" type="date" value={formData.sale_date} onChange={handleFormChange} required />
                        <FormField label="Sale Amount ($)" name="sale_price" type="number" value={formData.sale_price} onChange={handleFormChange} placeholder="e.g. 55000" />
                        
                        <FormField label="Employee (Sales Rep)" name="employee_id" value={formData.employee_id} onChange={handleFormChange} required
                            options={employees.map(e => ({ value: e.id, label: `${e.name} (${e.role})` }))} />
                        
                        <FormField label="Car (Available Only)" name="car_id" value={formData.car_id} onChange={handleFormChange} required
                            options={cars.map(c => ({ value: c.id, label: `${c.make} ${c.model} (${c.year}) - $${c.price}` }))} />
                        
                        <FormField label="Customer" name="customer_id" value={formData.customer_id} onChange={handleFormChange} required
                            options={customers.map(c => ({ value: c.id, label: `${c.name} - ${c.city}` }))} />
                        
                        <p className="text-xs text-yellow-500/80 bg-yellow-500/10 rounded-lg px-3 py-2 border border-yellow-500/20 shadow-inner">
                            <span className="font-bold mr-1 block mb-1">AUTOMATED SYSTEM NOTE:</span> Generating a ledger entry will permanently link the selected vehicle to this transaction, altering its telemetry status across the platform network.
                        </p>
                        
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-colors glass-button bg-white/5 hover:bg-white/10">Cancel</button>
                            <button type="submit" className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-colors glass-button bg-blue-600 hover:bg-blue-500">Create Invoice</button>
                        </div>
                    </form>
                </Modal>
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
