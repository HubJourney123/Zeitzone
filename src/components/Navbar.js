import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import SideMenu from './SideMenu';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b ${
        isDark ? 'bg-[#0a0a0a]/95 border-[#1f1f1f]' : 'bg-white/95 border-gray-200'
      } backdrop-blur-md`}>
        {/* Left: Burger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#1f1f1f]' : 'hover:bg-gray-100'} transition`}
            aria-label="Menu"
          >
            <svg className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className={`font-serif text-xl font-bold tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ZEIT<span className="text-emerald-500">ZONE</span>
            </span>
          </Link>
        </div>

        {/* Right: Theme + Cart */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#1f1f1f] text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg hover:bg-emerald-900/30 transition"
            aria-label="Cart"
          >
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
