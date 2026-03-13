import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        Cookies.set('admin_token', data.token, { expires: 1 });
        router.push('/admin/dashboard');
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch {
      setError('Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-serif text-3xl font-bold tracking-widest text-white">
            ZEIT<span className="text-emerald-500">ZONE</span>
          </p>
          <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>

        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-6">
          <h1 className="text-white font-semibold text-lg mb-5">Sign In</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 transition"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-700 text-xs mt-4">
          <a href="/" className="hover:text-gray-500">← Back to Store</a>
        </p>
      </div>
    </div>
  );
}
