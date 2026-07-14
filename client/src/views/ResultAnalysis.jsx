import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Award, AlertTriangle, ArrowUpDown, ChevronDown, CheckCircle } from 'lucide-react';

export default function ResultAnalysis({ activeBatch, role }) {
  const [results, setResults] = useState([]);
  const [rangeSummary, setRangeSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [sortDesc, setSortDesc] = useState(false);

  useEffect(() => {
    if (activeBatch) {
      fetchResults();
    }
  }, [activeBatch]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/batches/${activeBatch._id}/results`);
      setResults(res.data.results || []);
      setRangeSummary(res.data.rangeSummary || []);
    } catch (err) {
      console.error('Error fetching results data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleSort = () => {
    const sorted = [...results].sort((a, b) => {
      const pctA = a.percentage === 'AB' ? -1 : Number(a.percentage);
      const pctB = b.percentage === 'AB' ? -1 : Number(b.percentage);
      return sortDesc ? pctA - pctB : pctB - pctA;
    });
    setResults(sorted);
    setSortDesc(!sortDesc);
  };

  // Validation: Check if there's at least one non-absent result submitted
  const activeSubmissionCount = results.filter(r => !r.isAbsent).length;
  const isExportDisabled = activeSubmissionCount === 0;

  const handleWordExport = () => {
    if (isExportDisabled) {
      showToast('Cannot export Result Analysis: No assessment responses have been submitted yet.', 'error');
      return;
    }
    window.open(`/api/batches/${activeBatch._id}/export/results/docx`, '_blank');
  };

  const handlePdfExport = () => {
    if (isExportDisabled) {
      showToast('Cannot export Result Analysis: No assessment responses have been submitted yet.', 'error');
      return;
    }
    window.open(`/api/batches/${activeBatch._id}/export/results/pdf`, '_blank');
  };

  if (!activeBatch) {
    return <div className="text-gray-400 text-sm">Please select a batch from the Dashboard first.</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide uppercase">Result Analysis & Reports</h2>
          <p className="text-xs text-gray-400 mt-1">Review student performance scorecards, analyze ranges, visualize slow/advanced learners, and generate exports.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleWordExport}
            disabled={isExportDisabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold/10 border border-gold/25 text-xs font-bold text-gold hover:bg-gold/20 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <Download className="w-3.5 h-3.5" /> Word Report
          </button>
          <button
            onClick={handlePdfExport}
            disabled={isExportDisabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold/10 border border-gold/25 text-xs font-bold text-gold hover:bg-gold/20 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <Download className="w-3.5 h-3.5" /> PDF Report
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'
        }`}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {isExportDisabled && (
        <div className="p-4 rounded-xl flex items-center gap-3 border bg-yellow-500/5 border-yellow-500/20 text-yellow-400 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Notice: Add student assessments in the <strong>Assessment Module</strong> to generate reports. At least one exam submission is required.</span>
        </div>
      )}

      {/* Main Scorecard Table */}
      <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 bg-navy-dark/30 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Student Scorecards</h3>
          <button
            type="button"
            onClick={handleSort}
            className="flex items-center gap-1 text-gold text-xs hover:underline"
          >
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by % ({sortDesc ? 'Asc' : 'Desc'})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full styled-table text-xs text-left">
            <thead>
              <tr>
                <th className="p-3 w-16 text-center">S.No</th>
                <th className="p-3">Student Name</th>
                <th className="p-3 w-20 text-center">Stream</th>
                <th className="p-3 w-24 text-center">Tamil</th>
                <th className="p-3 w-24 text-center">English</th>
                <th className="p-3 w-24 text-center">Maths</th>
                <th className="p-3 w-24 text-center">Core</th>
                <th className="p-3 w-24 text-center">Total</th>
                <th className="p-3 w-28 text-center">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => (
                <tr key={res.sNo || index} className="hover:bg-white/5 border-b border-white/5">
                  <td className="p-3 text-center text-gray-400">{res.sNo}</td>
                  <td className="p-3 text-white font-medium">{res.name}</td>
                  <td className="p-3 text-center">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-gray-400 font-bold">{res.mathsStream}</span>
                  </td>
                  <td className="p-3 text-center text-gray-300">{res.tamil}</td>
                  <td className="p-3 text-center text-gray-300">{res.english}</td>
                  <td className="p-3 text-center text-gray-300">{res.maths}</td>
                  <td className="p-3 text-center text-gray-300">{res.core}</td>
                  <td className="p-3 text-center text-white font-bold">{res.isAbsent ? 0 : res.total}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      res.isAbsent
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : Number(res.percentage) >= 70
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : Number(res.percentage) >= 50
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {res.percentage === 'AB' ? 'AB' : `${res.percentage}%`}
                    </span>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">
                    No results recorded for this batch. Run student test assessments first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ranges and Analytics Charts */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Range Summary Card */}
          <div className="glass-card p-6 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Result Range Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full styled-table text-xs text-left">
                <thead>
                  <tr>
                    <th className="p-3">Range Category</th>
                    <th className="p-3 w-32 text-center">No. of Students</th>
                    <th className="p-3 w-32 text-center">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {rangeSummary.map((r, idx) => (
                    <tr key={idx} className="hover:bg-white/5 border-b border-white/5">
                      <td className="p-3 text-gold font-bold">{r.range}</td>
                      <td className="p-3 text-center text-white">{r.count}</td>
                      <td className="p-3 text-center text-gray-300">{r.percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 rounded-lg bg-white/5 text-[10px] text-gray-400 italic">
              📢 <strong>Policy Rule:</strong> "THOSE WHO GOT 70 AND ABOVE ARE THE ADVANCED LEARNERS AND OTHERS ARE SLOW LEARNERS."
            </div>
          </div>

          {/* Visual Recharts Bar Chart */}
          <div className="glass-card p-6 rounded-xl border border-white/5 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Performance Analytics Visualizer</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rangeSummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="range" stroke="#9ca3af" fontSize={10} />
                  <YAxis stroke="#9ca3af" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0d30', borderColor: '#FFD700', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="count" name="Student Count" fill="#FFD700" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="percent" name="Student Percentage (%)" fill="#2a36b1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
