import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TEST_CREDENTIALS, isDemoMode } from '../services/mockAuthService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isDemo = isDemoMode();

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'client' | 'va') => {
    const credentials = TEST_CREDENTIALS[role];
    setEmail(credentials.email);
    setPassword(credentials.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f6f3] px-4">
      <div className="bg-white p-8 rounded-[20px] shadow-lg w-full max-w-md">
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="mb-6 bg-blue-50 border-2 border-blue-200 text-blue-800 px-4 py-3 rounded-[12px]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold">Demo Mode Active</p>
                <p className="text-xs mt-1">Using test data - no backend required</p>
              </div>
            </div>
          </div>
        )}

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#0F2052] mb-2">
            The Human Capital
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[12px] mb-6 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[56px] border border-[#e8e3dd] rounded-[12px] px-4 focus:outline-none focus:ring-2 focus:ring-[#0F2052] focus:border-transparent transition-all"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[56px] border border-[#e8e3dd] rounded-[12px] px-4 focus:outline-none focus:ring-2 focus:ring-[#0F2052] focus:border-transparent transition-all"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] bg-[#0F2052] text-white rounded-[12px] font-semibold hover:bg-[#1a2b5c] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        {isDemo && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">Test Accounts:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all"
                disabled={loading}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">👤 Admin Account</span>
                  <span className="text-xs text-gray-500">Click to fill</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  {TEST_CREDENTIALS.admin.email}
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('client')}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all"
                disabled={loading}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">💼 Client Account</span>
                  <span className="text-xs text-gray-500">Click to fill</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  {TEST_CREDENTIALS.client.email}
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoCredentials('va')}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all"
                disabled={loading}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">🎯 VA Account</span>
                  <span className="text-xs text-gray-500">Click to fill</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  {TEST_CREDENTIALS.va.email}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Secure authentication powered by JWT</p>
        </div>
      </div>
    </div>
  );
};
