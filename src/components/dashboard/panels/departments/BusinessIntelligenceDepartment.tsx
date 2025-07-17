import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { FiBarChart2, FiDownload, FiPieChart, FiFileText } from 'react-icons/fi';
import { FaChartBar } from 'react-icons/fa';

type KPI = {
  id: string;
  name: string;
  value: number;
  trend: string;
};

type Report = {
  id: string;
  title: string;
  created_at: string;
  author: string;
};

const BusinessIntelligenceDepartment: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBI();
  }, []);

  const fetchBI = async () => {
    setLoading(true);
    setError(null);
    const { data: kpiData, error: kpiError } = await supabase.from('kpis').select('*');
    const { data: reportData, error: reportError } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    if (kpiError || reportError) setError(kpiError?.message || reportError?.message || 'Error loading BI data');
    else {
      setKpis(kpiData || []);
      setReports(reportData || []);
    }
    setLoading(false);
  };

  // Placeholder for advanced features (charts, predictive analytics, export, etc.)
  // ...

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700"><FaChartBar /> Business Intelligence</h2>
          <p className="text-gray-500">KPIs, custom reports, predictive analytics, and more.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex items-center gap-2"><FiFileText /> New Report</button>
          <button className="btn-secondary flex items-center gap-2"><FiDownload /> Export Dashboard</button>
        </div>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex flex-col items-center">
            <div className="text-3xl text-blue-600 font-bold">{kpi.value}</div>
            <div className="text-gray-500">{kpi.name}</div>
            <div className={`text-xs mt-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{kpi.trend === 'up' ? '▲' : '▼'} Trend</div>
          </div>
        ))}
      </div>
      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Title</th>
              <th className="py-2">Author</th>
              <th className="py-2">Created</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={4} className="text-center text-red-500 py-8">{error}</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8">No reports found.</td></tr>
            ) : (
              reports.map(report => (
                <tr key={report.id} className="border-b hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                  <td className="py-2 font-bold flex items-center gap-2"><FiPieChart className="text-blue-600" /> {report.title}</td>
                  <td className="py-2">{report.author}</td>
                  <td className="py-2">{new Date(report.created_at).toLocaleString()}</td>
                  <td className="py-2 flex gap-2">
                    <button className="btn-xs btn-outline">View</button>
                    <button className="btn-xs btn-outline">Export</button>
                    <button className="btn-xs btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Placeholder for advanced features: charts, predictive analytics, export, etc. */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2 text-lg font-bold text-blue-700"><FiBarChart2 /> BI Analytics (Coming Soon)</div>
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center text-gray-400">Charts, predictive analytics, drill-down, and more will appear here.</div>
      </div>
    </div>
  );
};

export default BusinessIntelligenceDepartment; 