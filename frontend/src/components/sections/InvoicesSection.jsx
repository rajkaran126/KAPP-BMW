import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Table, SectionHeader, Modal, FormField, Toast, StatCard, ICONS } from '../shared/UIComponents';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Currency Helper: Formats amounts in ₹ Crores (Cr) and Lakhs (L)
const formatINR = (val) => {
    const num = parseFloat(val || 0);
    if (num >= 10000000) {
        return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
        return `₹${(num / 100000).toFixed(2)} L`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
};

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
            
            const rawInvoices = Array.isArray(invRes) ? invRes : (invRes?.data || []);
            const rawCars = Array.isArray(carRes) ? carRes : (carRes?.data || []);
            const rawEmployees = Array.isArray(empRes) ? empRes : (empRes?.data || []);
            const rawCustomers = Array.isArray(cusRes) ? cusRes : (cusRes?.data || []);

            setInvoices(rawInvoices);
            setCars(rawCars.filter(c => c.status === 'available'));
            setEmployees(rawEmployees);
            setCustomers(rawCustomers);
        } catch (err) {
            console.error('Invoice load error:', err);
            setToast({ type: 'error', msg: 'Failed to load invoices data' });
        }
        setLoading(false);
    };

    const handleFormChange = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleDownload = (invoice) => {
        const doc = new jsPDF();
        const invId = invoice.Invoice_ID || invoice.id;
        const invDate = invoice.Date || invoice.sale_date;
        const invAmt = invoice.amount || invoice.sale_price;
        const carInfo = invoice.car || invoice.Car;
        const empInfo = invoice.employee || invoice.Employee;
        const cusInfo = invoice.customer || invoice.Customer;
        
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
        doc.text('OFFICIAL SALES INVOICE', 145, 25);

        // Details
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(12);
        let y = 60;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice Details', 14, y);
        doc.setFont('helvetica', 'normal');
        y += 10;
        doc.text(`Invoice ID: #${invId}`, 14, y); y += 8;
        doc.text(`Date: ${new Date(invDate).toLocaleDateString('en-IN')}`, 14, y); y += 8;
        doc.text(`Amount: ${formatINR(invAmt)}`, 14, y); y += 15;

        // Entities
        doc.autoTable({
            startY: y,
            head: [['BMW Model', 'Sales Executive', 'Customer Name']],
            body: [[
                carInfo ? `${carInfo.Model} (${carInfo.Year || ''})` : 'N/A',
                empInfo ? (empInfo.Name || empInfo.name) : 'N/A',
                cusInfo ? (cusInfo.Name || cusInfo.name) : 'N/A'
            ]],
            headStyles: { fillColor: [28, 100, 242] },
            theme: 'grid'
        });

        doc.save(`KAPP_BMW_Invoice_${invId}.pdf`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                Date: formData.sale_date,
                amount: formData.sale_price,
                EmpID: formData.employee_id,
                Car_ID: formData.car_id,
                Cus_ID: formData.customer_id
            };
            await api.createInvoice(payload);
            setToast({ type: 'success', msg: 'Invoice created successfully! Car marked as sold.' });
            setIsAddOpen(false);
            setFormData({ car_id: '', employee_id: '', customer_id: '', sale_price: '', sale_date: new Date().toISOString().split('T')[0] });
            loadData();
        } catch (err) {
            setToast({ type: 'error', msg: err.response?.data?.error || 'Failed to create invoice' });
        }
    };

    const handleDelete = async (invoice) => {
        const invId = invoice.Invoice_ID || invoice.id;
        if (!confirm(`Delete Invoice #${invId}?`)) return;
        try { 
            await api.deleteInvoice(invId); 
            setToast({ msg: 'Invoice deleted. Car status updated.', type: 'success' }); 
            loadData(); 
        } catch (err) { 
            setToast({ msg: err.response?.data?.error || 'Error deleting invoice', type: 'error' }); 
        }
    };

    const totalRevenue = invoices.reduce((s, i) => s + parseFloat(i.amount || i.sale_price || 0), 0);

    return (
        <div>
            <SectionHeader title="Sales Invoices" subtitle="Sales transactions & ledger records" onAdd={() => { setFormData({ car_id: '', employee_id: '', customer_id: '', sale_price: '', sale_date: new Date().toISOString().split('T')[0] }); setIsAddOpen(true); }} addLabel="New Invoice" />
            
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Invoices" value={invoices.length} icon={ICONS.invoice} color="blue" />
                <StatCard label="Total Revenue" value={formatINR(totalRevenue)} icon={ICONS.report} color="green" />
                <StatCard label="Cars Sold" value={invoices.length} icon={ICONS.car} color="red" />
            </div>

            <div className="rounded-[2rem]">
                {loading ? <div className="text-center py-12 text-gray-400">Loading Invoices...</div> : (
                    <Table
                        columns={[
                            { key: 'id', label: 'ID', render: r => <span className="text-gray-400 font-mono">#{r.Invoice_ID || r.id}</span> },
                            { key: 'car', label: 'Vehicle Model', render: r => {
                                const c = r.car || r.Car;
                                return c ? <span className="font-medium text-white">{c.Model} ({c.Colour || 'White'})</span> : <span className="text-gray-500">Deleted Car</span>;
                            }},
                            { key: 'price', label: 'Sale Amount', render: r => <span className="text-emerald-400 font-bold">{formatINR(r.amount || r.sale_price)}</span> },
                            { key: 'customer', label: 'Customer', render: r => {
                                const cus = r.customer || r.Customer;
                                return cus ? <span className="text-gray-200">{cus.Name || cus.name} ({cus.City || cus.city})</span> : 'N/A';
                            }},
                            { key: 'employee', label: 'Sales Executive', render: r => {
                                const emp = r.employee || r.Employee;
                                return emp ? <span className="text-gray-300">{emp.Name || emp.name}</span> : 'N/A';
                            }},
                            { key: 'date', label: 'Date', render: r => new Date(r.Date || r.sale_date).toLocaleDateString('en-IN') },
                            { key: 'actions', label: '', render: r => (
                                <button onClick={(e) => { e.stopPropagation(); handleDownload(r); }} 
                                    className="p-2 shrink-0 flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-lg hover:scale-105 ml-auto"
                                    title="Download PDF Invoice">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline px-1">PDF</span>
                                </button>
                            )}
                        ]}
                        data={invoices} onDelete={handleDelete} emptyMsg="No invoices recorded yet. Click New Invoice to record a sale." />
                )}
            </div>

            {isAddOpen && (
                <Modal title="Create New Sales Invoice" onClose={() => setIsAddOpen(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField label="Sale Date" name="sale_date" type="date" value={formData.sale_date} onChange={handleFormChange} required />
                        <FormField label="Sale Amount (₹ INR)" name="sale_price" type="number" value={formData.sale_price} onChange={handleFormChange} placeholder="e.g. 7800000" required />
                        
                        <FormField label="Sales Executive" name="employee_id" value={formData.employee_id} onChange={handleFormChange} required
                            options={employees.map(e => ({ value: e.EmpID || e.id, label: `${e.Name || e.name} (${e.designation || 'Sales'})` }))} />
                        
                        <FormField label="BMW Vehicle (Available Only)" name="car_id" value={formData.car_id} onChange={handleFormChange} required
                            options={cars.map(c => ({ value: c.Car_ID || c.id, label: `${c.Model} (${c.Year}) - ${formatINR(c.price)}` }))} />
                        
                        <FormField label="Customer" name="customer_id" value={formData.customer_id} onChange={handleFormChange} required
                            options={customers.map(c => ({ value: c.Cus_ID || c.id, label: `${c.Name || c.name} - ${c.City || c.city}` }))} />
                        
                        <p className="text-xs text-blue-400/80 bg-blue-500/10 rounded-lg px-3 py-2 border border-blue-500/20 shadow-inner">
                            <span className="font-bold mr-1 block mb-1">SYSTEM AUTOMATION:</span> Creating an invoice automatically logs the transaction and updates vehicle availability across regional showrooms.
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
