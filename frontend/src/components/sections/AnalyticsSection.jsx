import { useState, useEffect, useRef } from 'react';
import { analyticsAPI } from '../../utils/api';
import { ICONS, StatCard, SectionHeader, Toast, Icon } from '../shared/UIComponents';

// ─── Mini Bar Chart (SVG) ──────────────────────────────────────────────────────
function BarChart({ data, valueKey, labelKey, color = '#3b82f6' }) {
    if (!data.length) return <div className="text-center py-8 text-gray-500 text-sm">No trend data yet — create some invoices to see charts.</div>;
    const maxVal = Math.max(...data.map(d => parseFloat(d[valueKey] || 0)));
    return (
        <div className="flex items-end gap-2 h-36 w-full">
            {data.map((d, i) => {
                const pct = maxVal > 0 ? (parseFloat(d[valueKey] || 0) / maxVal) * 100 : 0;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group" title={`${d[labelKey]}: ₹${parseFloat(d[valueKey] || 0).toLocaleString('en-IN')}`}>
                        <div className="w-full rounded-t-sm transition-all duration-500 hover:opacity-80 relative"
                            style={{ height: `${Math.max(pct, 4)}%`, background: color, minHeight: '4px' }}>
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white bg-gray-800 rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                                ₹{(parseFloat(d[valueKey] || 0) / 100000).toFixed(1)}L
                            </div>
                        </div>
                        <p className="text-gray-500 text-[10px] truncate w-full text-center">{d[labelKey]?.split(' ')[0] || ''}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default function AnalyticsSection() {
    const [overview, setOverview] = useState(null);
    const [salesTrend, setSalesTrend] = useState([]);
    const [modelPerf, setModelPerf] = useState([]);
    const [empPerf, setEmpPerf] = useState([]);
    const [custInsights, setCustInsights] = useState({ byCity: [], byCountry: [] });
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [insightsError, setInsightsError] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const pdfRef = useRef(null);

    const downloadPDF = async () => {
        if (!pdfRef.current) return;
        setPdfLoading(true);
        try {
            const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
                import('jspdf'),
                import('html2canvas'),
            ]);
            const el = pdfRef.current;
            const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#0a0a18', useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const margin = 12;
            const contentW = pageW - margin * 2;

            pdf.setFillColor(6, 6, 20);
            pdf.rect(0, 0, pageW, 24, 'F');
            pdf.setTextColor(96, 165, 250);
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('KAPP-BMW', margin, 10);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(156, 163, 175);
            pdf.text('Analytics Report', margin, 16);
            const now = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });
            pdf.text(`Generated: ${now}`, pageW - margin, 10, { align: 'right' });

            let y = 30;
            if (overview) {
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(255, 255, 255);
                pdf.text('Key Performance Indicators', margin, y); y += 6;
                pdf.setDrawColor(30, 105, 212);
                pdf.setLineWidth(0.4);
                pdf.line(margin, y, pageW - margin, y); y += 5;
                const kpis = [
                    ['Total Revenue', `\u20b9${(parseFloat(overview.total_revenue || 0) / 100000).toFixed(2)} L`],
                    ['Total Cars', `${overview.total_cars}`],
                    ['Cars Sold', `${overview.sold_cars}`],
                    ['Cars Available', `${overview.available_cars}`],
                    ['Conversion Rate', `${overview.conversion_rate}%`],
                    ['Total Employees', `${overview.total_employees}`],
                    ['Total Customers', `${overview.total_customers}`],
                    ['Total Invoices', `${overview.total_invoices}`],
                    ['Avg. Deal Value', `\u20b9${(parseFloat(overview.avg_sale_value || 0) / 100000).toFixed(2)} L`],
                ];
                const colW = (contentW - 4) / 2;
                kpis.forEach(([label, value], i) => {
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    const xPos = margin + col * (colW + 4);
                    const yPos = y + row * 9;
                    pdf.setFontSize(8);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(156, 163, 175);
                    pdf.text(label, xPos, yPos);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(255, 255, 255);
                    pdf.text(value, xPos + colW - 4, yPos, { align: 'right' });
                });
                y += Math.ceil(kpis.length / 2) * 9 + 6;
            }

            if (empPerf.length > 0) {
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(255, 255, 255);
                pdf.text('Employee Leaderboard', margin, y); y += 6;
                pdf.setDrawColor(168, 85, 247);
                pdf.line(margin, y, pageW - margin, y); y += 4;
                const headers = ['Rank', 'Name', 'Deals', 'Revenue', 'Avg Deal'];
                const colWidths = [14, 60, 18, 40, 40];
                pdf.setFontSize(7.5);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(156, 163, 175);
                let xCur = margin;
                headers.forEach((h, i) => { pdf.text(h, xCur, y); xCur += colWidths[i]; });
                y += 5;
                empPerf.slice(0, 5).forEach((e, idx) => {
                    const cols = [
                        `${idx + 1}`,
                        e.Name,
                        `${e.invoices_closed}`,
                        `\u20b9${(parseFloat(e.revenue_generated || 0) / 100000).toFixed(1)}L`,
                        `\u20b9${(parseFloat(e.avg_deal_size || 0) / 100000).toFixed(1)}L`,
                    ];
                    pdf.setFont('helvetica', idx === 0 ? 'bold' : 'normal');
                    pdf.setTextColor(idx === 0 ? 251 : 209, idx === 0 ? 191 : 213, idx === 0 ? 36 : 219);
                    xCur = margin;
                    cols.forEach((c, i) => { pdf.text(c, xCur, y); xCur += colWidths[i]; });
                    y += 6;
                });
                y += 4;
            }

            if (insights.length > 0) {
                if (y > pageH - 60) { pdf.addPage(); y = 20; }
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(255, 255, 255);
                pdf.text('Business Insights', margin, y); y += 6;
                pdf.setDrawColor(99, 102, 241);
                pdf.line(margin, y, pageW - margin, y); y += 5;
                insights.forEach((ins, i) => {
                    if (y > pageH - 24) { pdf.addPage(); y = 20; }
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'bold');
                    const dotColors = [[96, 165, 250], [192, 132, 252], [74, 222, 128], [251, 146, 60], [244, 114, 182]];
                    const [r2, g2, b2] = dotColors[i % dotColors.length];
                    pdf.setTextColor(r2, g2, b2);
                    pdf.text(`${i + 1}. ${ins.heading}`, margin, y); y += 5;
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(209, 213, 219);
                    const wrapped = pdf.splitTextToSize(ins.detail, contentW - 6);
                    pdf.text(wrapped, margin + 4, y);
                    y += wrapped.length * 4.5 + 3;
                });
            }

            pdf.addPage();
            pdf.setFillColor(6, 6, 20);
            pdf.rect(0, 0, pageW, 14, 'F');
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(96, 165, 250);
            pdf.text('Analytics Dashboard Screenshot', margin, 10);
            const imgW = contentW;
            const imgH = (canvas.height / canvas.width) * imgW;
            const maxImgH = pageH - 22;
            if (imgH <= maxImgH) {
                pdf.addImage(imgData, 'PNG', margin, 16, imgW, imgH);
            } else {
                const scale2 = maxImgH / imgH;
                const sliceH = Math.floor(canvas.height * scale2);
                let srcY = 0;
                let firstPage = true;
                while (srcY < canvas.height) {
                    if (!firstPage) pdf.addPage();
                    const slice = document.createElement('canvas');
                    slice.width = canvas.width;
                    slice.height = Math.min(sliceH, canvas.height - srcY);
                    const ctx2 = slice.getContext('2d');
                    ctx2.drawImage(canvas, 0, srcY, canvas.width, slice.height, 0, 0, canvas.width, slice.height);
                    const sliceData = slice.toDataURL('image/png');
                    const sliceRenderH = (slice.height / canvas.width) * imgW;
                    pdf.addImage(sliceData, 'PNG', margin, firstPage ? 16 : 8, imgW, sliceRenderH);
                    srcY += slice.height;
                    firstPage = false;
                }
            }

            const totalPages = pdf.getNumberOfPages();
            for (let p = 1; p <= totalPages; p++) {
                pdf.setPage(p);
                pdf.setFontSize(7);
                pdf.setTextColor(75, 85, 99);
                pdf.text(`KAPP-BMW Confidential  |  Page ${p} of ${totalPages}  |  ${now}`, pageW / 2, pageH - 5, { align: 'center' });
            }

            pdf.save(`KAPP-BMW-Analytics-${new Date().toISOString().slice(0, 10)}.pdf`);
            setToast({ msg: 'PDF downloaded successfully!', type: 'success' });
        } catch (err) {
            console.error('PDF error:', err);
            setToast({ msg: 'PDF generation failed: ' + err.message, type: 'error' });
        }
        setPdfLoading(false);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [ov, st, mp, ep, ci] = await Promise.all([
                analyticsAPI.getOverview(),
                analyticsAPI.getSalesTrend(),
                analyticsAPI.getModelPerformance(),
                analyticsAPI.getEmployeePerformance(),
                analyticsAPI.getCustomerInsights(),
            ]);
            setOverview(ov.data);
            setSalesTrend(st.data);
            setModelPerf(mp.data);
            setEmpPerf(ep.data);
            setCustInsights(ci.data);
        } catch (err) {
            setToast({ msg: 'Error loading analytics: ' + (err.response?.data?.error || err.message), type: 'error' });
        }
        setLoading(false);
    };

    const fetchInsights = async (ov, st, mp, ep) => {
        setInsightsLoading(true);
        setInsights([]);
        setInsightsError(null);
        try {
            const r = await analyticsAPI.getAIInsights({ overview: ov, salesTrend: st, modelPerformance: mp, employeePerformance: ep });
            setInsights(r.data?.insights || []);
        } catch (err) {
            const status = err.response?.status;
            const errData = err.response?.data;
            if (status === 429 || errData?.error === 'quota_exceeded') {
                setInsightsError(errData?.message || 'API quota reached. Please wait a minute and try again.');
            } else {
                setToast({ msg: 'Analytics error: ' + (errData?.error || err.message), type: 'error' });
            }
        }
        setInsightsLoading(false);
    };

    useEffect(() => { loadData(); }, []);
    useEffect(() => {
        if (overview && salesTrend.length >= 0 && modelPerf.length >= 0 && empPerf.length >= 0) {
            fetchInsights(overview, salesTrend, modelPerf, empPerf);
        }
    }, [overview]);

    const insightColors = [
        { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa', dot: '#3b82f6' },
        { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', text: '#c084fc', dot: '#a855f7' },
        { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', text: '#4ade80', dot: '#22c55e' },
        { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)', text: '#fb923c', dot: '#f97316' },
        { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)', text: '#f472b6', dot: '#ec4899' },
    ];

    const fmt = (v) => parseFloat(v || 0).toLocaleString('en-IN');
    const fmtL = (v) => `₹${(parseFloat(v || 0) / 100000).toFixed(1)}L`;

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-400">Loading analytics data...</p>
        </div>
    );

    return (
        <div className="space-y-8" ref={pdfRef}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="p-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
                            <Icon path={ICONS.analytics} size={22} />
                        </span>
                        Analytics Dashboard
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Powered by real-time data</p>
                </div>
                <button onClick={() => { loadData(); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm transition-all">
                    <Icon path={ICONS.refresh} size={15} /> Refresh
                </button>
                <button onClick={downloadPDF} disabled={pdfLoading || loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}
                    title="Download full analytics report as PDF">
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    {pdfLoading ? 'Generating PDF...' : 'Download PDF'}
                </button>
            </div>

            {/* KPI Row */}
            {overview && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Revenue" value={fmtL(overview.total_revenue)} icon={ICONS.report} color="green" />
                    <StatCard label="Cars Sold" value={overview.sold_cars} icon={ICONS.car} color="red" />
                    <StatCard label="Conversion Rate" value={`${overview.conversion_rate}%`} icon={ICONS.check} color="blue" />
                    <StatCard label="Avg. Deal Value" value={fmtL(overview.avg_sale_value)} icon={ICONS.invoice} color="purple" />
                </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 className="text-white font-semibold mb-1">Monthly Revenue Trend</h3>
                    <p className="text-gray-500 text-xs mb-5">Last 12 months of invoice data</p>
                    <BarChart data={salesTrend} valueKey="revenue" labelKey="label" color="#3b82f6" />
                </div>
                <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 className="text-white font-semibold mb-1">Top Models by Revenue</h3>
                    <p className="text-gray-500 text-xs mb-4">Best-performing car models</p>
                    {modelPerf.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">No data yet — add invoices to see model performance.</div>
                    ) : (
                        <div className="space-y-3">
                            {modelPerf.slice(0, 5).map((m, i) => {
                                const maxRev = parseFloat(modelPerf[0]?.total_revenue || 1);
                                const pct = (parseFloat(m.total_revenue || 0) / maxRev) * 100;
                                const colors = ['#3b82f6', '#a855f7', '#22c55e', '#f97316', '#ec4899'];
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-300 font-medium">{m.Model || 'Unknown'}</span>
                                            <span className="text-gray-500">{m.units_sold} sold · {fmtL(m.total_revenue)}</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: colors[i] }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Employee Leaderboard + Customer Geo */}
            <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 className="text-white font-semibold mb-1">Employee Leaderboard</h3>
                    <p className="text-gray-500 text-xs mb-4">Ranked by revenue generated</p>
                    {empPerf.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">No employee data yet.</div>
                    ) : (
                        <div className="space-y-3">
                            {empPerf.slice(0, 5).map((e, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                                        style={{ background: i === 0 ? 'rgba(251,191,36,0.2)' : i === 1 ? 'rgba(156,163,175,0.2)' : 'rgba(180,120,60,0.2)', color: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : '#b47c3c' }}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-semibold truncate">{e.Name}</p>
                                        <p className="text-gray-500 text-xs">{e.invoices_closed} deals</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-green-400 text-sm font-bold">{fmtL(e.revenue_generated)}</p>
                                        <p className="text-gray-600 text-xs">avg {fmtL(e.avg_deal_size)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 className="text-white font-semibold mb-1">Customer Geography</h3>
                    <p className="text-gray-500 text-xs mb-4">Top cities & countries</p>
                    {custInsights.byCity.length === 0 && custInsights.byCountry.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">No geographic data yet — add customers with City/Country fields.</div>
                    ) : (
                        <div className="space-y-4">
                            {custInsights.byCity.length > 0 && (
                                <div>
                                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">By City</p>
                                    <div className="space-y-1.5">
                                        {custInsights.byCity.map((c, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="text-gray-300 text-sm">{c.City}</span>
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/15 text-blue-400">{c.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {custInsights.byCountry.length > 0 && (
                                <div>
                                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">By Country</p>
                                    <div className="space-y-1.5">
                                        {custInsights.byCountry.map((c, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="text-gray-300 text-sm">{c.Country}</span>
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-400">{c.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Insights Panel */}
            <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(168,85,247,0.07) 100%)', border: '1px solid rgba(99,102,241,0.25)' }}>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                            <Icon path={ICONS.spark} size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Business Insights</h3>
                            <p className="text-gray-500 text-xs">Data-driven analysis of your dealership</p>
                        </div>
                    </div>
                    <button onClick={() => fetchInsights(overview, salesTrend, modelPerf, empPerf)}
                        disabled={insightsLoading || !overview}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 border border-blue-500/30 hover:border-blue-500/60 disabled:opacity-40 transition-all">
                        <Icon path={insightsLoading ? ICONS.warning : ICONS.spark} size={13} />
                        {insightsLoading ? 'Generating...' : 'Re-generate'}
                    </button>
                </div>

                {insightsLoading ? (
                    <div className="flex items-center gap-4 py-6">
                        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin shrink-0" />
                        <div>
                            <p className="text-white text-sm font-medium">Analyzing your data...</p>
                            <p className="text-gray-500 text-xs">This may take a few seconds</p>
                        </div>
                    </div>
                ) : insightsError ? (
                    <div className="rounded-xl p-5 flex gap-4 items-start" style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)' }}>
                        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-orange-300 font-semibold text-sm mb-1">Quota Exceeded</p>
                            <p className="text-orange-200/80 text-xs leading-relaxed mb-3">{insightsError}</p>
                            <div className="flex items-center gap-3">
                                <button onClick={() => fetchInsights(overview, salesTrend, modelPerf, empPerf)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                    style={{ background: 'rgba(251,146,60,0.2)', border: '1px solid rgba(251,146,60,0.4)', color: '#fdba74' }}>
                                    Try Again
                                </button>
                                <a href="https://console.cloud.google.com/apis/dashboard" target="_blank" rel="noreferrer"
                                    className="text-xs text-orange-400/70 hover:text-orange-400 underline underline-offset-2">View API plans →</a>
                            </div>
                        </div>
                    </div>
                ) : insights.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {insights.map((ins, i) => {
                            const c = insightColors[i % insightColors.length];
                            return (
                                <div key={i} className="rounded-xl p-4" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: c.dot }} />
                                        <div>
                                            <p className="font-semibold text-sm mb-1" style={{ color: c.text }}>{ins.heading}</p>
                                            <p className="text-gray-300 text-xs leading-relaxed">{ins.detail}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-gray-500 text-sm">Click Re-generate to get insights on your dealership data.</p>
                    </div>
                )}
            </div>

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
