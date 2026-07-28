import { useState, useEffect } from 'react';
import { carAPI, employeeAPI, customerAPI, invoiceAPI } from '../../utils/api';
import { ICONS, StatCard, Icon } from '../shared/UIComponents';

const formatINR = (val) => {
    const num = parseFloat(val || 0);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
};

export default function DashboardSection({ setTab }) {
    const [stats, setStats] = useState({ cars: 0, employees: 0, customers: 0, invoices: 0, revenue: 0, available: 0 });

    useEffect(() => {
        Promise.all([carAPI.getAll(), employeeAPI.getAll(), customerAPI.getAll(), invoiceAPI.getAll()])
            .then(([c, e, cu, i]) => {
                const cars = Array.isArray(c) ? c : (c?.data || []);
                const employees = Array.isArray(e) ? e : (e?.data || []);
                const customers = Array.isArray(cu) ? cu : (cu?.data || []);
                const invoices = Array.isArray(i) ? i : (i?.data || []);
                setStats({
                    cars: cars.length, 
                    employees: employees.length, 
                    customers: customers.length,
                    invoices: invoices.length, 
                    available: cars.filter(x => x.status === 'available').length,
                    revenue: invoices.reduce((s, x) => s + parseFloat(x.amount || x.sale_price || 0), 0)
                });
            }).catch((err) => { console.error('Dashboard load error:', err); });
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
                <StatCard label="Revenue" value={formatINR(stats.revenue)} icon={ICONS.report} color="green" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { tab: 'cars', icon: ICONS.car, label: 'Manage Cars', desc: 'Add, edit, view inventory' },
                    { tab: 'employees', icon: ICONS.employee, label: 'Manage Employees', desc: 'Staff & qualifications' },
                    { tab: 'customers', icon: ICONS.customer, label: 'Manage Customers', desc: 'Customer database' },
                    { tab: 'invoices', icon: ICONS.invoice, label: 'Sales Invoices', desc: 'Create & view sales' },
                    { tab: 'reports', icon: ICONS.report, label: 'Reports', desc: 'Cursor-based analytics' },
                    { tab: 'analytics', icon: ICONS.analytics, label: 'Analytics', desc: 'Data insights & charts' },
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
