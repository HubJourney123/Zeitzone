import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES = [
  {
    id: 'mens',
    label: "Men's Watch",
    icon: '⌚',
    subs: [
      { id: 'metal', label: 'Metal Strip' },
      { id: 'leather', label: 'Leather Strip' },
    ],
  },
  {
    id: 'ladies',
    label: "Lady's Watch",
    icon: '💎',
    subs: [
      { id: 'metal', label: 'Metal Strip' },
      { id: 'leather', label: 'Leather Strip' },
    ],
  },
  {
    id: 'smart',
    label: 'Smart Watch',
    icon: '📱',
    subs: [],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    icon: '🔗',
    subs: [],
  },
];

export default function SideMenu({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const [expanded, setExpanded] = useState(null);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 z-50 slide-in flex flex-col ${
        isDark ? 'bg-[#0f0f0f] border-r border-[#1f1f1f]' : 'bg-white border-r border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-[#1f1f1f]' : 'border-gray-100'}`}>
          <span className={`font-serif text-lg font-bold tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ZEIT<span className="text-emerald-500">ZONE</span>
          </span>
          <button onClick={onClose} className={`p-1 rounded ${isDark ? 'hover:bg-[#1f1f1f] text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <p className={`px-5 mb-2 text-xs font-medium uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Categories
          </p>
          {CATEGORIES.map(cat => (
            <div key={cat.id}>
              {cat.subs.length > 0 ? (
                <>
                  <button
                    onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                    className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition ${
                      isDark ? 'hover:bg-[#1a1a1a] text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${expanded === cat.id ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expanded === cat.id && (
                    <div className={`ml-10 border-l ${isDark ? 'border-emerald-900' : 'border-emerald-200'}`}>
                      {/* All in category */}
                      <Link
                        href={`/category/${cat.id}`}
                        onClick={onClose}
                        className={`block px-4 py-2.5 text-sm transition ${isDark ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-500 hover:text-emerald-600'}`}
                      >
                        All {cat.label}
                      </Link>
                      {cat.subs.map(sub => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.id}/${sub.id}`}
                          onClick={onClose}
                          className={`block px-4 py-2.5 text-sm transition ${isDark ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-500 hover:text-emerald-600'}`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={`/category/${cat.id}`}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition ${
                    isDark ? 'hover:bg-[#1a1a1a] text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </Link>
              )}
            </div>
          ))}

          {/* Divider */}
          <div className={`my-4 mx-5 border-t ${isDark ? 'border-[#1f1f1f]' : 'border-gray-100'}`} />

          {/* Social Links */}
          <p className={`px-5 mb-2 text-xs font-medium uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Connect
          </p>
          <a href="https://wa.me/8801795818784" target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-3 px-5 py-3 text-sm transition ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'}`}>
            <span>💬</span> WhatsApp
          </a>
          <a href="https://www.instagram.com/zeitzone_watch" target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-3 px-5 py-3 text-sm transition ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'}`}>
            <span>📸</span> Instagram
          </a>
          <a href="https://www.facebook.com/profile.php?id=61585824444108" target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-3 px-5 py-3 text-sm transition ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'}`}>
            <span>📘</span> Facebook
          </a>
          <a href="mailto:zeitzonewatch@gmail.com"
            className={`flex items-center gap-3 px-5 py-3 text-sm transition ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'}`}>
            <span>✉️</span> Email Us
          </a>
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t text-center text-xs ${isDark ? 'border-[#1f1f1f] text-gray-600' : 'border-gray-100 text-gray-400'}`}>
          Wear Your Royal Moment
        </div>
      </div>
    </>
  );
}
