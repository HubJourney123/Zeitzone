import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function BottomNav() {
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();
  const { isDark } = useTheme();

  const WA_NUMBER = '8801795818784';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around h-16 border-t ${
      isDark ? 'bg-[#0a0a0a]/95 border-[#1f1f1f]' : 'bg-white/95 border-gray-200'
    } backdrop-blur-md`}>
      {/* Watches */}
      <button
        onClick={() => router.push('/')}
        className={`flex flex-col items-center gap-1 px-6 py-2 transition ${
          router.pathname === '/' ? 'text-emerald-500' : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="7" strokeWidth="2"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l2.5 2.5"/>
          <path strokeLinecap="round" strokeWidth="2" d="M9.5 3.5h5M9.5 20.5h5"/>
        </svg>
        <span className="text-[10px] font-medium">Watches</span>
      </button>

      {/* WhatsApp - Center Elevated */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello ZEITZONE! I want to enquire about a watch.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 -mt-5"
      >
        <div className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/50 transition">
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <span className={`text-[10px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>WhatsApp</span>
      </a>

      {/* Cart */}
      <button
        onClick={() => setIsCartOpen(true)}
        className={`flex flex-col items-center gap-1 px-6 py-2 transition relative ${
          isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium">Cart</span>
      </button>
    </nav>
  );
}
