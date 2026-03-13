import { useState } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import WatchCard from '../components/WatchCard';
import { useTheme } from '../context/ThemeContext';
import sql from '../lib/db';

const CATS = [
  { id: 'all', label: 'All' },
  { id: 'mens', label: "Men's" },
  { id: 'ladies', label: "Lady's" },
  { id: 'smart', label: 'Smart' },
  { id: 'accessories', label: 'Accessories' },
];

export default function Home({ products, carouselSlides }) {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? products
    : products.filter(p => p.category === activeTab);

  return (
    <div className={isDark ? 'bg-[#0a0a0a] min-h-screen' : 'bg-[#f5f5f0] min-h-screen'}>
      {/* Hero Carousel */}
      <HeroCarousel slides={carouselSlides} />

      {/* Brand tagline */}
      <div className="text-center py-5 px-4">
        <p className={`font-serif text-2xl font-bold tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ZEIT<span className="text-emerald-500">ZONE</span>
        </p>
        <p className={`text-xs mt-1 tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Wear Your Royal Moment
        </p>
      </div>

      {/* Category Tabs */}
      <div className="px-4 mb-4">
        <div className={`flex gap-2 overflow-x-auto pb-1 scrollbar-hide`}>
          {CATS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeTab === cat.id
                  ? 'bg-emerald-700 text-white'
                  : isDark
                    ? 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222] hover:text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="7" strokeWidth="1.5"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l2.5 2.5"/>
            </svg>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No watches in this category yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => <WatchCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`border-t py-8 px-4 text-center ${isDark ? 'border-[#1f1f1f]' : 'border-gray-200'}`}>
        <p className={`font-serif text-lg font-bold tracking-widest mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ZEIT<span className="text-emerald-500">ZONE</span>
        </p>
        <p className={`text-xs mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Wear Your Royal Moment</p>
        <div className="flex justify-center gap-6 mb-4">
          <a href="https://wa.me/8801795818784" target="_blank" rel="noopener noreferrer" className="text-emerald-500 text-xs hover:underline">WhatsApp</a>
          <a href="https://www.instagram.com/zeitzone_watch" target="_blank" rel="noopener noreferrer" className="text-emerald-500 text-xs hover:underline">Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61585824444108" target="_blank" rel="noopener noreferrer" className="text-emerald-500 text-xs hover:underline">Facebook</a>
          <a href="mailto:zeitzonewatch@gmail.com" className="text-emerald-500 text-xs hover:underline">Email</a>
        </div>
        <p className={`text-[10px] ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>© 2024 ZEITZONE. All rights reserved.</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    const carouselSlides = await sql`SELECT * FROM carousel_images WHERE active = true ORDER BY sort_order ASC`;
    return {
      props: {
        products: products.map(p => ({
          ...p,
          images: p.images || [],
          original_price: Number(p.original_price),
          discount_price: Number(p.discount_price),
          delivery_fee: Number(p.delivery_fee),
          created_at: p.created_at?.toISOString() || null,
          updated_at: p.updated_at?.toISOString() || null,
        })),
        carouselSlides: carouselSlides.map(s => ({
          ...s,
          created_at: s.created_at?.toISOString() || null,
        })),
      }
    };
  } catch (e) {
    console.error(e);
    return { props: { products: [], carouselSlides: [] } };
  }
}