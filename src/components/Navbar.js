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
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b ${
        isDark ? 'bg-[#0a0a0a]/95 border-[#1f1f1f]' : 'bg-white/95 border-gray-200'
      } backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Burger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className={`p-2 rounded-lg lg:hidden ${isDark ? 'hover:bg-[#1f1f1f]' : 'hover:bg-gray-100'} transition`}
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

            {/* Desktop category links */}
            <div className="hidden lg:flex items-center gap-1 ml-8">
              {[
                { href: '/category/mens', label: "Men's" },
                { href: '/category/ladies', label: "Lady's" },
                { href: '/category/smart', label: 'Smart' },
                { href: '/category/accessories', label: 'Accessories' },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isDark ? 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: WhatsApp + Theme + Cart */}
          <div className="flex items-center gap-2">
            {/* WhatsApp link on desktop */}
            <a href="https://wa.me/8801795818784" target="_blank" rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>

            <button onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#1f1f1f] text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition`}>
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

            <button onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-emerald-900/30 transition">
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
        </div>
      </nav>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}