import { useState, useEffect } from 'react';
import { reportsAPI } from '../../utils/api';
import { ICONS, Table, SectionHeader, Toast, Icon } from '../shared/UIComponents';

const formatINR = (val) => {
    const num = parseFloat(val || 0);
    if (num >= 10000000) {
        return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
        return `₹${(num / 100000).toFixed(2)} L`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
};

export default function ReportsSection() {
    const [salesReport, setSalesReport] = useState([]);
    const [availableCars, setAvailableCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeReport, setActiveReport] = useState('sales');
    const [toast, setToast] = useState(null);

    const loadReport = async (type) => {
        setLoading(true);
        setActiveReport(type);
        try {
            if (type === 'sales') { 
                const r = await reportsAPI.getSalesReport(); 
                const data = Array.isArray(r) ? r : (r?.data || []);
                setSalesReport(data); 
            } else { 
                const r = await reportsAPI.getAvailableCarsSummary(); 
                const data = Array.isArray(r) ? r : (r?.data || []);
                setAvailableCars(data); 
            }
        } catch (err) { 
            console.error('Report error:', err);
            setToast({ msg: 'Error loading report: ' + (err.response?.data?.error || err.message), type: 'error' }); 
        }
        setLoading(false);
    };

    useEffect(() => { loadReport('sales'); }, []);

    return (
        <div>
            <SectionHeader title="Reports & Analytics" subtitle="Cursor-based stored procedure & SQL reports" />
            <div className="flex gap-3 mb-6">
                {[
                    { key: 'sales', label: 'Employee Sales Report', desc: 'GenerateEmployeeSalesReport()' },
                    { key: 'cars', label: 'Available Cars Summary', desc: 'GetAvailableCarsSummary()' },
                ].map(r => (
                    <button key={r.key} onClick={() => loadReport(r.key)}
                        className={`flex-1 p-4 rounded-xl border border-white/10 text-left transition-all ${activeReport === r.key ? 'bg-white/10 border-blue-500/50' : 'bg-white/3 hover:bg-white/5'}`}>
                        <p className="text-white font-semibold text-sm">{r.label}</p>
                        <p className="text-gray-400 text-xs mt-1 font-mono">{r.desc}</p>
                    </button>
                ))}
                <button onClick={() => loadReport(activeReport)}
                    className="p-4 rounded-xl border border-white/10 bg-white/3 hover:border-white/20 text-gray-400 hover:text-white transition-all">
                    <Icon path={ICONS.refresh} size={18} />
                </button>
            </div>

            <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {loading ? <div className="text-center py-12 text-gray-400">Loading Report Data...</div> : (
                    activeReport === 'sales' ? (
                        <Table
                            columns={[
                                { key: 'EmpID', label: 'Emp ID' },
                                { key: 'EmployeeName', label: 'Sales Executive', render: r => <span className="font-medium text-white">{r.EmployeeName || r.Name}</span> },
                                { key: 'total_invoices', label: 'Invoices Issued' },
                                { key: 'total_amount', label: 'Total Revenue Generated', render: r => <span className="text-emerald-400 font-bold">{formatINR(r.total_amount || r.amount)}</span> },
                                { key: 'cars_sold', label: 'Cars Sold' },
                            ]}
                            data={salesReport} emptyMsg="No sales report data available. Add employees and create invoices first." />
                    ) : (
                        <Table
                            columns={[
                                { key: 'Car_ID', label: 'Car ID' },
                                { key: 'Model', label: 'BMW Model', render: r => <span className="font-medium text-white">{r.Model}</span> },
                                { key: 'Colour', label: 'Colour' },
                                { key: 'Year', label: 'Year' },
                                { key: 'IL_No', label: 'IL No.' },
                                { key: 'seller_count', label: 'Sellers Associated' },
                            ]}
                            data={availableCars} emptyMsg="No available cars found in showroom inventory." />
                    )
                )}
            </div>
            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
