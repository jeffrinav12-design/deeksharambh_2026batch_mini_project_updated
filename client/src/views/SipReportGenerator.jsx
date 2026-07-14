import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, FileText, Download, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function SipReportGenerator({ activeBatch, role }) {
  const [reportText, setReportText] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [newObjective, setNewObjective] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const defaultReportText = `The Student Induction Program for the newly admitted first-year students for the academic year ${activeBatch ? activeBatch.academicYear : ''} was conducted from ${activeBatch ? activeBatch.startDate : ''} to ${activeBatch ? activeBatch.endDate : ''}. Eminent personalities from various fields were invited to address the students throughout the program.

As per the guidelines of Bharathiar University, the Induction Program is organized every year before the commencement of regular first-semester classes, facilitated by trained faculty members.

The objective of the program is to bridge the gap between higher secondary education and undergraduate studies, providing students with a solid foundation in Applied Science and English at a moderate level. This ensures that students transition smoothly into the academic rigors of regular coursework.

Spanning six days, the program offers meaningful exposure to Universal Human Values, alongside various co-curricular and extra-curricular activities. It serves as an ideal platform for students to shed initial hesitation, engage confidently, and build strong bonds with faculty members.

Over the years, this Student Induction Programme has made a noticeable impact on the overall performance of students. Feedback from students and parents alike has been overwhelmingly positive. This initiative continues to play a vital role in ensuring a smooth academic and emotional transition for incoming students.`;

  const defaultObjectives = [
    'Help students feel at ease in the new academic environment',
    'Encourage exploration of academic interests and institutional activities',
    'Cultivate collaboration over competition, nurturing a drive for excellence',
    'Strengthen the student-teacher bond',
    'Offer a broader perspective on life, values, and responsibility',
    'Shape character and instill life-enriching values'
  ];

  useEffect(() => {
    if (activeBatch) {
      fetchReport();
    }
  }, [activeBatch]);

  const fetchReport = async () => {
    try {
      const res = await axios.get(`/api/batches/${activeBatch._id}/sip-report`);
      if (res.data.reportText) {
        setReportText(res.data.reportText);
      } else {
        setReportText(defaultReportText);
      }

      if (res.data.objectives && res.data.objectives.length > 0) {
        setObjectives(res.data.objectives);
      } else {
        setObjectives(defaultObjectives);
      }
    } catch (err) {
      console.error('Error fetching SIP report:', err);
    }
  };

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (role === 'viewer') {
      showToast('Viewers cannot edit the report.', 'error');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/api/batches/${activeBatch._id}/sip-report`, {
        reportText,
        objectives
      });
      showToast('SIP Report details updated and saved successfully!');
      fetchReport();
    } catch (err) {
      showToast('Failed to save report details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (idx) => {
    setObjectives(objectives.filter((_, i) => i !== idx));
  };

  if (!activeBatch) {
    return <div className="text-gray-400 text-sm">Please select a batch from the Dashboard first.</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide uppercase">SIP Narrative Report</h2>
          <p className="text-xs text-gray-400 mt-1">Compose the Student Induction Program narrative report, set objectives, and generate formatted docx/pdf deliverables.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.open(`/api/batches/${activeBatch._id}/export/sip/docx`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold/10 border border-gold/25 text-xs font-bold text-gold hover:bg-gold/20"
          >
            <Download className="w-3.5 h-3.5" /> Word Report
          </button>
          <button
            onClick={() => window.open(`/api/batches/${activeBatch._id}/export/sip/pdf`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold/10 border border-gold/25 text-xs font-bold text-gold hover:bg-gold/20"
          >
            <Download className="w-3.5 h-3.5" /> PDF Report
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Narrative Paragraph Editor */}
        <div className="glass-card p-6 rounded-xl border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-gold uppercase tracking-wider border-b border-white/5 pb-2">Narrative Document Text</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">Standard Introduction and Overview</label>
            <textarea
              rows="12"
              disabled={role === 'viewer'}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full px-4 py-3 rounded-lg glass-input text-xs leading-relaxed"
              placeholder="Enter narrative report paragraphs..."
            ></textarea>
          </div>
        </div>

        {/* Objectives Builder */}
        <div className="glass-card p-6 rounded-xl border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-gold uppercase tracking-wider border-b border-white/5 pb-2">Program Objectives</h3>
          
          {role !== 'viewer' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg glass-input text-xs"
                placeholder="e.g. Cultivate team collaboration skills"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-4 py-2 rounded-lg bg-gold text-navy-dark font-bold text-xs hover:bg-gold-light transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          )}

          <div className="space-y-2 mt-4">
            {objectives.map((obj, idx) => (
              <div key={idx} className="flex justify-between items-center px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-xs">
                <span className="text-gray-300">• {obj}</span>
                {role !== 'viewer' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {role !== 'viewer' && (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-gold to-yellow-400 text-navy-dark font-bold text-sm hover:from-yellow-400 hover:to-gold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Report Details</span>
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
}
