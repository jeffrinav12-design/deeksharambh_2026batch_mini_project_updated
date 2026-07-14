import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Check, X, Users, Download, Search, AlertCircle } from 'lucide-react';

export default function StudentMaster({ activeBatch, role }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Add Form State
  const [newName, setNewName] = useState('');
  const [newMathsStream, setNewMathsStream] = useState('M');

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMathsStream, setEditMathsStream] = useState('M');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Full'); // Full, Maths, NonMaths

  useEffect(() => {
    if (activeBatch) {
      fetchStudents();
    }
  }, [activeBatch]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`/api/batches/${activeBatch._id}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (role !== 'admin') {
      showToast('Faculty and Viewers cannot manage student records.', 'error');
      return;
    }
    if (!newName.trim()) {
      showToast('Please enter a student name.', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/students', {
        batchId: activeBatch._id,
        name: newName.trim().toUpperCase(),
        mathsStream: newMathsStream
      });
      setNewName('');
      showToast('Student added successfully!');
      fetchStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add student', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (role !== 'admin') {
      showToast('Only admins can delete student records.', 'error');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this student? All their results and attendance will be removed.')) {
      return;
    }

    try {
      await axios.delete(`/api/students/${studentId}`);
      showToast('Student deleted successfully!');
      fetchStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete student', 'error');
    }
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setEditName(student.name);
    setEditMathsStream(student.mathsStream);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (studentId) => {
    if (role !== 'admin') {
      showToast('Only admins can edit student records.', 'error');
      return;
    }
    if (!editName.trim()) {
      showToast('Student name cannot be empty.', 'error');
      return;
    }

    try {
      await axios.put(`/api/students/${studentId}`, {
        name: editName.trim().toUpperCase(),
        mathsStream: editMathsStream
      });
      setEditingId(null);
      showToast('Student details updated successfully!');
      fetchStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update student details', 'error');
    }
  };

  if (!activeBatch) {
    return <div className="text-gray-400 text-sm">Please select a batch from the Dashboard first.</div>;
  }

  // Filter students based on search query and tab selection
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || String(s.sNo).includes(searchQuery);
    if (!matchesSearch) return false;
    
    if (activeTab === 'Maths') return s.mathsStream === 'M';
    if (activeTab === 'NonMaths') return s.mathsStream === 'NM';
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide uppercase">Student Master</h2>
          <p className="text-xs text-gray-400 mt-1">Manage the student roster, assign them to Mathematics or Non-Mathematics groups, and export student lists.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.open(`/api/batches/${activeBatch._id}/export/students?type=Full`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold/10 border border-gold/25 text-xs font-bold text-gold hover:bg-gold/20"
          >
            <Download className="w-3.5 h-3.5" /> Full List
          </button>
          <button
            onClick={() => window.open(`/api/batches/${activeBatch._id}/export/students?type=Maths`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold/10 border border-gold/25 text-xs font-bold text-gold hover:bg-gold/20"
          >
            <Download className="w-3.5 h-3.5" /> Maths List
          </button>
          <button
            onClick={() => window.open(`/api/batches/${activeBatch._id}/export/students?type=NonMaths`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold/10 border border-gold/25 text-xs font-bold text-gold hover:bg-gold/20"
          >
            <Download className="w-3.5 h-3.5" /> Non-Maths List
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Add Student */}
        {role === 'admin' && (
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-xl border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-gold uppercase tracking-wider border-b border-white/5 pb-2">Add Student</h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg glass-input text-sm uppercase"
                    placeholder="e.g. ANGELIN GIFTY.I"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Mathematics Background Stream</label>
                  <select
                    value={newMathsStream}
                    onChange={(e) => setNewMathsStream(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg glass-input text-sm"
                  >
                    <option value="M">Maths Students (M)</option>
                    <option value="NM">Non-Maths Students (NM)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-gold text-navy-dark font-bold text-xs hover:bg-gold-light transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Student
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Right Table List */}
        <div className={role === 'admin' ? 'lg:col-span-2 space-y-4' : 'lg:col-span-3 space-y-4'}>
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-navy-dark/40 border border-white/5 p-4 rounded-xl">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name or S.No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg glass-input text-xs"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 p-1 rounded-lg bg-navy-deep border border-white/5 w-full sm:w-auto">
              {['Full', 'Maths', 'NonMaths'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded capitalize transition-all duration-150 ${
                    activeTab === tab
                      ? 'bg-gold text-navy-dark'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === 'Full' ? 'All' : tab === 'Maths' ? 'Maths (M)' : 'Non-Maths (NM)'}
                </button>
              ))}
            </div>
          </div>

          {/* Roster Table */}
          <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full styled-table text-xs text-left">
                <thead>
                  <tr>
                    <th className="p-3 w-16 text-center">S.No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3 w-32">Maths Stream</th>
                    {role === 'admin' && <th className="p-3 w-28 text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((st, index) => {
                    const isEditing = editingId === st._id;
                    return (
                      <tr key={st._id} className="hover:bg-white/5 border-b border-white/5">
                        <td className="p-3 text-center text-gray-400">{st.sNo}</td>
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-2 py-1 rounded glass-input text-xs w-full uppercase"
                            />
                          ) : (
                            <span className="text-white font-medium">{st.name}</span>
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <select
                              value={editMathsStream}
                              onChange={(e) => setEditMathsStream(e.target.value)}
                              className="px-2 py-1 rounded glass-input text-xs w-full"
                            >
                              <option value="M">M (Maths)</option>
                              <option value="NM">NM (Non-Maths)</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              st.mathsStream === 'M' 
                                ? 'bg-gold/10 text-gold border border-gold/20' 
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}>
                              {st.mathsStream === 'M' ? 'M (Maths)' : 'NM (Non-Maths)'}
                            </span>
                          )}
                        </td>
                        {role === 'admin' && (
                          <td className="p-3 text-center">
                            {isEditing ? (
                              <div className="flex justify-center gap-1.5">
                                <button
                                  onClick={() => saveEdit(st._id)}
                                  className="p-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-center gap-1.5">
                                <button
                                  onClick={() => startEdit(st)}
                                  className="p-1 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(st._id)}
                                  className="p-1 rounded bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={role === 'admin' ? 4 : 3} className="p-8 text-center text-gray-500 text-xs">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
