//src/pages/category/[...slug].js
import WatchCard from '../../components/WatchCard';
import { useTheme } from '../../context/ThemeContext';
import sql from '../../lib/db';
import { useRouter } from 'next/router';
import Link from 'next/link';

const CAT_LABELS = {
  mens: "Men's Watch",
  ladies: "Lady's Watch",
  smart: 'Smart Watch',
  accessories: 'Accessories',
};
const SUB_LABELS = {
  metal: 'Metal Strip',
  leather: 'Leather Strip',
};

export default function CategoryPage({ products, category, subcategory }) {
  const { isDark } = useTheme();
  const router = useRouter();

  const title = subcategory
    ? `${CAT_LABELS[category] || category} — ${SUB_LABELS[subcategory] || subcategory}`
    : CAT_LABELS[category] || category;

  const hasSubs = ['mens', 'ladies'].includes(category);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f0]'}`}>
      {/* Header */}
      <div className={`sticky top-14 z-30 px-4 py-3 ${isDark ? 'bg-[#0a0a0a] border-b border-[#1f1f1f]' : 'bg-[#f5f5f0] border-b border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-[#1f1f1f] text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className={`font-serif text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
        </div>

        {/* Sub-category pills */}
        {hasSubs && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            <Link href={`/category/${category}`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                !subcategory ? 'bg-emerald-700 text-white' : isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-white text-gray-500 border border-gray-200'
              }`}>
              All
            </Link>
            <Link href={`/category/${category}/metal`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                subcategory === 'metal' ? 'bg-emerald-700 text-white' : isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-white text-gray-500 border border-gray-200'
              }`}>
              Metal Strip
            </Link>
            <Link href={`/category/${category}/leather`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                subcategory === 'leather' ? 'bg-emerald-700 text-white' : isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-white text-gray-500 border border-gray-200'
              }`}>
              Leather Strip
            </Link>
          </div>
        )}
      </div>

      <div className="px-4 py-4">
        <p className={`text-xs mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{products.length} product{products.length !== 1 ? 's' : ''}</p>
        {products.length === 0 ? (
          <div className="text-center py-16">
            <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="7" strokeWidth="1.5"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l2.5 2.5"/>
            </svg>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No watches here yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map(p => <WatchCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const [category, subcategory] = params.slug;
  try {
    let products;
    if (subcategory) {
      products = await sql`SELECT * FROM products WHERE category = ${category} AND subcategory = ${subcategory} ORDER BY created_at DESC`;
    } else {
      products = await sql`SELECT * FROM products WHERE category = ${category} ORDER BY created_at DESC`;
    }
    return {
      props: {
        products: products.map(p => ({ ...p, images: p.images || [], original_price: Number(p.original_price), discount_price: Number(p.discount_price), delivery_fee: Number(p.delivery_fee), created_at: p.created_at?.toISOString() || null, updated_at: p.updated_at?.toISOString() || null })),
        category: category || null,
        subcategory: subcategory || null,
      }
    };
  } catch (e) {
    return { props: { products: [], category: category || null, subcategory: subcategory || null } };
  }
}
