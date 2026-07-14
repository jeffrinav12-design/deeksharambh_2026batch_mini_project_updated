import React, { useState } from 'react';
import axios from 'axios';
import { Shield, Key, Mail, Lock } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [roleSelection, setRoleSelection] = useState('admin');
  const [email, setEmail] = useState('admin@sankara.ac.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role) => {
    setRoleSelection(role);
    if (role === 'admin') {
      setEmail('admin@sankara.ac.in');
      setPassword('admin123');
    } else if (role === 'faculty') {
      setEmail('faculty@sankara.ac.in');
      setPassword('faculty123');
    } else {
      setEmail('viewer@sankara.ac.in');
      setPassword('viewer123');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      onLoginSuccess(res.data.token, res.data.role, res.data.name);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep flex items-center justify-center relative px-6 overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-navy/20 blur-[120px] top-[-10%] left-[-10%]"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] bottom-[-10%] right-[-10%]"></div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10 border border-white/10 shadow-2xl">
        
        {/* Branding header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <svg className="w-12 h-12 text-gold animate-pulse mb-3" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M50 25 L80 40 L50 55 L20 40 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="3"/>
            <path d="M50 55 L50 95" stroke="currentColor" strokeWidth="4"/>
          </svg>
          <h1 className="text-xl font-bold text-white tracking-wide uppercase">Deeksharambh</h1>
          <p className="text-xs text-gray-400 mt-1">Bridge Course Management System</p>
          <p className="text-[10px] text-gold tracking-widest uppercase mt-0.5">Sankara College of Science and Commerce</p>
        </div>

        {/* Quick Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6 p-1 rounded-lg bg-navy-dark border border-white/5">
          {['admin', 'faculty', 'viewer'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              className={`py-2 text-xs font-semibold rounded-md capitalize transition-all duration-150 ${
                roleSelection === r 
                  ? 'bg-gold text-navy-dark shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {r === 'faculty' ? 'staff' : r}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-gold to-yellow-400 text-navy-dark font-bold text-sm hover:from-yellow-400 hover:to-gold transition-all duration-200 shadow-lg hover:shadow-gold/15 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Secure Log In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-4 text-[10px] text-gray-500">
          Authorized Academic Portal. Department of CSDA © 2026.
        </div>
      </div>
    </div>
  );
}
