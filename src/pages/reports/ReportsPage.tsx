import React, { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '../../store/app.store';
import { toast } from 'sonner';
import {
  Search,
  Calendar,
  Download,
  RefreshCw,
  X,
  Eye,
  CheckCircle,
  AlertTriangle,
  Printer,
  FileSpreadsheet,
  Award,
  Activity,
  Layers,
  MapPin
} from 'lucide-react';

// Count-up AnimatedNumber component for stats
const AnimatedNumber = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1200; // Animation duration in ms
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target]);

  return <>{count}</>;
};

const ReportsPage: React.FC = () => {
  // Integrate state management using the Zustand store
  const {
    reports,
    originalReports,
    searchQuery,
    centerFilter,
    resultFilter,
    dateFilter,
    currentPage,
    selectedReport,
    isExportingPDF,
    isExportingCSV,
    isRefreshing,
    sortField,
    sortDirection,
    setSearchQuery,
    setCenterFilter,
    setResultFilter,
    setDateFilter,
    setCurrentPage,
    setSelectedReport,
    toggleSort,
    handleRefresh,
    handleExportPDF,
    handleExportCSV
  } = useAppStore();

  // Dynamic calculations of KPIs based on filtered reports
  const totalCount = reports.length;
  const passCount = reports.filter((r) => r.result === 'Pass').length;
  const failCount = reports.filter((r) => r.result === 'Fail').length;
  const passRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;
  
  const totalRevenue = reports.reduce((acc, r) => {
    const feeNum = parseFloat(r.fee.replace('OMR ', ''));
    return acc + feeNum;
  }, 0);

  // Simulated Weekly Pass vs Fail SVG Chart calculation
  const weeklyData = [
    { day: 'Mon', pass: 12, fail: 2 },
    { day: 'Tue', pass: 18, fail: 4 },
    { day: 'Wed', pass: 15, fail: 3 },
    { day: 'Thu', pass: 22, fail: 5 },
    { day: 'Fri', pass: 25, fail: 7 },
    { day: 'Sat', pass: 8, fail: 1 },
    { day: 'Sun', pass: 14, fail: 2 }
  ];

  // Volume by Center comparative breakdown
  const centerData = useMemo(() => {
    const counts: Record<string, number> = { Muscat: 0, Seeb: 0, Sohar: 0, Salalah: 0 };
    originalReports.forEach((r) => {
      if (counts[r.centre] !== undefined) {
        counts[r.centre]++;
      }
    });
    const maxVal = Math.max(...Object.values(counts));
    return Object.entries(counts).map(([name, val]) => ({
      name,
      count: val,
      percentage: maxVal > 0 ? Math.round((val / maxVal) * 100) : 0
    }));
  }, [originalReports]);

  // Pagination bounds
  const recordsPerPage = 5;
  const paginatedReports = useMemo(() => {
    const startIdx = (Number(currentPage) - 1) * recordsPerPage;
    return reports.slice(startIdx, startIdx + recordsPerPage);
  }, [reports, currentPage]);

  const totalPages = Math.max(1, Math.ceil(reports.length / recordsPerPage));

  return (
    <div className="w-full text-gray-900" style={{ boxSizing: 'border-box' }}>
      
      {/* Top Filter & Actions Panel */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 mb-5 shadow-sm transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Filter Widgets */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-65">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Plate, Job ID, Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9.5 pl-10 pr-8 bg-neutral-50/70 border border-neutral-200 rounded-xl text-[13.5px] font-medium text-slate-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Date Range Selector */}
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-9.5 pl-9 pr-8 bg-neutral-50/70 border border-neutral-200 rounded-xl text-[13px] font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-slate-500 transition-all cursor-pointer appearance-none"
              >
                <option value="Today">Today</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="All Time">All Time</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Centre Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={centerFilter}
                onChange={(e) => setCenterFilter(e.target.value)}
                className="h-9.5 pl-9 pr-8 bg-neutral-50/70 border border-neutral-200 rounded-xl text-[13px] font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-slate-500 transition-all cursor-pointer appearance-none"
              >
                <option value="All">All Centres</option>
                <option value="Muscat">Muscat</option>
                <option value="Seeb">Seeb</option>
                <option value="Sohar">Sohar</option>
                <option value="Salalah">Salalah</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Result Filter */}
            <div className="relative">
              <Award className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="h-9.5 pl-9 pr-8 bg-neutral-50/70 border border-neutral-200 rounded-xl text-[13px] font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-slate-500 transition-all cursor-pointer appearance-none"
              >
                <option value="All">All Results</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sync Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-9.5 h-9.5 flex items-center justify-center bg-neutral-50/70 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 text-slate-600 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              title="Synchronize Records"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

          </div>

          {/* Right: Export Pipelines */}
          <div className="flex items-center gap-2.5">
            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              disabled={isExportingCSV || totalCount === 0}
              className="flex items-center justify-center gap-1.5 h-9.5 px-4 bg-white border border-neutral-200 text-slate-700 font-semibold text-[13px] rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {isExportingCSV ? (
                <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              )}
              <span>Export CSV</span>
            </button>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF || totalCount === 0}
              className="flex items-center justify-center gap-1.5 h-9.5 px-4 bg-slate-900 text-white font-semibold text-[13px] rounded-xl hover:bg-slate-800 active:bg-slate-950 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {isExportingPDF ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Export PDF Summary</span>
            </button>
          </div>

        </div>
      </div>

      {/* KPI Stats summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        
        {/* Metric 1: Total Inspections */}
        <div className="bg-[#F8FAF8] rounded-2xl border border-neutral-200/80 p-5 flex flex-col justify-between shadow-sm min-h-27.5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <span className="text-[13.5px] font-bold text-neutral-500 tracking-tight leading-snug uppercase">Total Inspections</span>
            <Activity className="w-4.5 h-4.5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-[32px] font-bold text-slate-800 leading-none tracking-tight">
              <AnimatedNumber target={totalCount} />
            </h2>
            <span className="text-[12px] font-bold text-slate-400">vehicles</span>
          </div>
        </div>

        {/* Metric 2: Pass Rate */}
        <div className="bg-[#F6FDF9] rounded-2xl border border-emerald-200/60 p-5 flex flex-col justify-between shadow-sm min-h-27.5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <span className="text-[13.5px] font-bold text-emerald-600 tracking-tight leading-snug uppercase">Pass Rate</span>
            <CheckCircle className="w-4.5 h-4.5 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-[32px] font-bold text-emerald-700 leading-none tracking-tight">
              <AnimatedNumber target={passRate} />%
            </h2>
            <span className="text-[12px] font-semibold text-emerald-500">{passCount} passed</span>
          </div>
        </div>

        {/* Metric 3: Fail Rate */}
        <div className="bg-[#FFF8F8] rounded-2xl border border-rose-200/60 p-5 flex flex-col justify-between shadow-sm min-h-27.5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <span className="text-[13.5px] font-bold text-rose-600 tracking-tight leading-snug uppercase">Fail Rate</span>
            <AlertTriangle className="w-4.5 h-4.5 text-rose-500 group-hover:text-rose-600 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-[32px] font-bold text-rose-700 leading-none tracking-tight">
              <AnimatedNumber target={totalCount > 0 ? 100 - passRate : 0} />%
            </h2>
            <span className="text-[12px] font-semibold text-rose-500">{failCount} failed</span>
          </div>
        </div>

        {/* Metric 4: Fee/Revenue */}
        <div className="bg-[#FAF9FF] rounded-2xl border border-indigo-200/60 p-5 flex flex-col justify-between shadow-sm min-h-27.5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <span className="text-[13.5px] font-bold text-indigo-600 tracking-tight leading-snug uppercase">Total Fees Collected</span>
            <Layers className="w-4.5 h-4.5 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-[16px] font-bold text-indigo-500">OMR</span>
            <h2 className="text-[32px] font-bold text-indigo-700 leading-none tracking-tight">
              <AnimatedNumber target={totalRevenue} />.000
            </h2>
          </div>
        </div>

      </div>

      {/* Analytics Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mb-5">
        
        {/* Left: SVG Bar Chart for Pass/Fail Volume */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[15.5px] font-bold text-slate-800">Weekly Inspection Volume & Pass Trends</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">Showing successful vs failed testing counts per weekday</p>
          </div>

          <div className="w-full aspect-22/9 mt-6 relative select-none">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="40" y1="65" x2="580" y2="65" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="40" y1="110" x2="580" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              <line x1="40" y1="155" x2="580" y2="155" stroke="#f1f5f9" strokeWidth="1" />

              {/* Weekly bar items */}
              {weeklyData.map((d, index) => {
                const xCoord = 70 + index * 72;
                const passHeight = (d.pass / 35) * 135;
                const failHeight = (d.fail / 35) * 135;
                const passY = 155 - passHeight;
                const failY = 155 - failHeight;

                return (
                  <g key={d.day} className="group/bar cursor-pointer">
                    {/* Hover area */}
                    <rect
                      x={xCoord - 18}
                      y="10"
                      width="50"
                      height="170"
                      fill="transparent"
                      className="hover:fill-slate-50/50 transition-colors"
                    />

                    {/* Pass Bar */}
                    <rect
                      x={xCoord - 10}
                      y={passY}
                      width="12"
                      height={passHeight}
                      rx="3"
                      fill="#10b981"
                      className="transition-all duration-300 hover:opacity-90"
                    />
                    
                    {/* Fail Bar */}
                    <rect
                      x={xCoord + 4}
                      y={failY}
                      width="12"
                      height={failHeight}
                      rx="3"
                      fill="#f43f5e"
                      className="transition-all duration-300 hover:opacity-90"
                    />

                    {/* X axis Day label */}
                    <text
                      x={xCoord + 3}
                      y="178"
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {d.day}
                    </text>

                    {/* Tooltip dynamic numeric indicator */}
                    <g className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200">
                      <rect
                        x={xCoord - 25}
                        y={Math.min(passY, failY) - 30}
                        width="60"
                        height="22"
                        rx="4"
                        fill="#1e293b"
                      />
                      <text
                        x={xCoord + 5}
                        y={Math.min(passY, failY) - 15}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="700"
                      >
                        {d.pass}P / {d.fail}F
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center gap-4 mt-3 border-t border-neutral-100 pt-3 text-[12px] font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Passed Inspection (Pass)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Failed Deficiencies (Fail)</span>
            </div>
          </div>
        </div>

        {/* Right: Centre Distribution Comparative Horizontal Bars */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[15.5px] font-bold text-slate-800">Operational Density by Centre</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">Total processed vehicle records per terminal</p>
          </div>

          <div className="flex flex-col gap-4.5 my-6 flex-1 justify-center">
            {centerData.map((c) => (
              <div key={c.name} className="flex flex-col">
                <div className="flex justify-between items-center text-[12.5px] font-bold text-slate-700 mb-1">
                  <span>{c.name}</span>
                  <span className="text-[12px] text-slate-500 font-semibold">{c.count} vehicles</span>
                </div>
                
                {/* Horizontal comparative progress bar */}
                <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-800 rounded-full transition-all duration-1000 ease-out hover:opacity-90"
                    style={{ width: `${c.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-100 pt-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total original database entries calculated
          </div>
        </div>

      </div>

      {/* Main Tabular Detailed reports Table */}
      <div className="w-full bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Header Section */}
        <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center bg-[#F9FAFB]">
          <h3 className="text-[15px] font-bold text-slate-800">Vehicle Inspection Report Logs</h3>
          <span className="text-[12px] text-slate-500 font-semibold">
            Showing {reports.length > 0 ? (Number(currentPage) - 1) * recordsPerPage + 1 : 0} - {Math.min(Number(currentPage) * recordsPerPage, reports.length)} of {reports.length} records
          </span>
        </div>

        {/* Scrollable table grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[13px] text-slate-500 font-bold uppercase select-none">
                
                <th
                  onClick={() => toggleSort('id')}
                  className="px-5 py-3 cursor-pointer hover:bg-neutral-100 transition-colors"
                  style={{ padding: '12px 20px' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Job ID</span>
                    {sortField === 'id' && (
                      <span className="text-slate-700 text-[10px]">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('plate')}
                  className="px-5 py-3 cursor-pointer hover:bg-neutral-100 transition-colors"
                  style={{ padding: '12px 20px' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Vehicle Plate</span>
                    {sortField === 'plate' && (
                      <span className="text-slate-700 text-[10px]">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('customer')}
                  className="px-5 py-3 cursor-pointer hover:bg-neutral-100 transition-colors"
                  style={{ padding: '12px 20px' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Customer Owner</span>
                    {sortField === 'customer' && (
                      <span className="text-slate-700 text-[10px]">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('centre')}
                  className="px-5 py-3 cursor-pointer hover:bg-neutral-100 transition-colors"
                  style={{ padding: '12px 20px' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Testing Centre</span>
                    {sortField === 'centre' && (
                      <span className="text-slate-700 text-[10px]">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('date')}
                  className="px-5 py-3 cursor-pointer hover:bg-neutral-100 transition-colors"
                  style={{ padding: '12px 20px' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Inspection Date</span>
                    {sortField === 'date' && (
                      <span className="text-slate-700 text-[10px]">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>

                <th className="px-5 py-3" style={{ padding: '12px 20px' }}>Result Outcome</th>
                <th className="px-5 py-3 text-right" style={{ padding: '12px 20px' }}>Action</th>

              </tr>
            </thead>
            
            <tbody className="divide-y divide-neutral-100 text-[13.5px] font-medium text-slate-700">
              {paginatedReports.length > 0 ? (
                paginatedReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="hover:bg-neutral-50/50 bg-white transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-5 py-4 font-bold text-slate-800 underline hover:text-indigo-600 transition-colors" style={{ padding: '15px 20px' }}>
                      {report.id}
                    </td>
                    <td className="px-5 py-4" style={{ padding: '15px 20px' }}>{report.plate}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800" style={{ padding: '15px 20px' }}>{report.customer}</td>
                    <td className="px-5 py-4" style={{ padding: '15px 20px' }}>{report.centre}</td>
                    <td className="px-5 py-4 font-semibold text-neutral-500" style={{ padding: '15px 20px' }}>{report.date}</td>
                    <td className="px-5 py-4" style={{ padding: '15px 20px' }}>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-bold select-none border ${
                          report.result === 'Pass'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${report.result === 'Pass' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {report.result}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right" style={{ padding: '15px 20px' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/70 text-slate-700 text-[12px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View VIR</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 font-semibold">
                    No matching vehicle reports found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-5 py-3 border-t border-neutral-100 bg-[#ffffff]">
          <span className="text-[13px] font-semibold text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, Number(currentPage) - 1))}
              disabled={Number(currentPage) === 1}
              className={`px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold transition-all bg-white ${
                Number(currentPage) === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, Number(currentPage) + 1))}
              disabled={Number(currentPage) >= totalPages}
              className={`px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold transition-all bg-white ${
                Number(currentPage) >= totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Sliding Detail Modal: Vehicle Inspection Certificate */}
      {selectedReport && (
        <div className="fixed inset-0 flex items-center justify-end z-50 transition-all select-none" style={{ backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(3px)' }}>
          
          {/* Modal Container */}
          <div
            className="w-full max-w-145 h-screen bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft border-l border-neutral-200"
            style={{ animation: 'slideLeft 0.25s ease-out' }}
          >
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center bg-[#F9FAFB]">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Official Inspection Certificate</span>
                <h2 className="text-[18px] font-bold text-slate-800 leading-tight mt-0.5">
                  VIR Summary - {selectedReport.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full border border-neutral-200 hover:bg-neutral-100 flex items-center justify-center text-gray-500 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 select-text">
              
              {/* Pass/Fail Stamp */}
              <div className="flex justify-between items-center border border-neutral-100 rounded-2xl p-4 bg-slate-50/50 shadow-sm relative overflow-hidden">
                <div>
                  <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Overall Determination</p>
                  <p className="text-[13.5px] font-bold text-slate-800 mt-1">Inspected on {selectedReport.date}</p>
                </div>
                
                <div
                  className={`px-6 py-2.5 rounded-xl border-2 uppercase font-extrabold text-[18px] tracking-widest rotate-6 ${
                    selectedReport.result === 'Pass'
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50/40'
                      : 'border-rose-500 text-rose-600 bg-rose-50/40'
                  }`}
                >
                  {selectedReport.result}
                </div>
              </div>

              {/* Owner and Vehicle Details */}
              <div className="flex flex-col gap-3.5">
                <h4 className="text-[13.5px] font-bold text-slate-800 uppercase tracking-wide border-b border-neutral-100 pb-1.5">Vehicle Information</h4>
                
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="text-slate-400 font-semibold block">Owner Name</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">{selectedReport.customer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Phone Number</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">{selectedReport.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Chassis Number (VIN)</span>
                    <span className="text-slate-800 font-mono font-bold mt-0.5 block">{selectedReport.chassis}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Vehicle Plate</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">{selectedReport.plate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Testing Centre</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">{selectedReport.centre}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Inspection Fee</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">{selectedReport.fee}</span>
                  </div>
                </div>
              </div>

              {/* Comprehensive Checklists Details */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[13.5px] font-bold text-slate-800 uppercase tracking-wide border-b border-neutral-100 pb-1.5">System Checklists</h4>

                <div className="flex flex-col border border-neutral-100 rounded-xl overflow-hidden divide-y divide-neutral-100 shadow-sm bg-white">
                  {selectedReport.checklist.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center px-4 py-3 text-[13px] hover:bg-neutral-50/20 transition-colors">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11.5px] text-slate-400 font-semibold mt-0.5">{item.category} Category</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-bold font-mono">{item.value}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.status === 'Pass'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions footer */}
            <div className="px-6 py-4.5 border-t border-neutral-100 bg-[#F9FAFB] flex gap-3">
              <button
                onClick={() => {
                  toast.success('Document prepared for direct printer spool.');
                  window.print();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 h-10 border border-neutral-200 hover:bg-neutral-50 text-slate-700 font-bold text-[13px] rounded-xl transition-all cursor-pointer bg-white"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              
              <button
                onClick={() => {
                  toast.success('Certificate download completed.');
                }}
                className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[13px] rounded-xl transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Report File</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Styled slide animation in global CSS */}
      <style>{`
        @keyframes slideLeft {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

    </div>
  );
};

export default ReportsPage;
