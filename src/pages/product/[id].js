import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import sql from '../../lib/db';

const WA_NUMBER = '8801795818784';

export default function ProductPage({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [null];
  const discount = Math.round(((product.original_price - product.discount_price) / product.original_price) * 100);

  const handleBuyNow = () => {
    const msg = encodeURIComponent(
      `Hello ZEITZONE! I want to buy:\n\n*${product.name}*\nPrice: ৳${Number(product.discount_price).toLocaleString()}\nDelivery Fee: ৳${Number(product.delivery_fee).toLocaleString()}\n\nPlease confirm availability. Thank you!`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!', {
      style: {
        background: isDark ? '#141414' : '#fff',
        color: isDark ? '#fff' : '#1a1a1a',
        border: '1px solid #059669',
      },
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f0]'}`}>

      {/* Back button */}
      <div className="px-4 pt-2 pb-1">
        <button onClick={() => router.back()} className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Desktop: two-column / Mobile: single column */}
      <div className="lg:flex lg:gap-10 lg:px-4 lg:py-6">

        {/* LEFT — Images */}
        <div className="lg:w-1/2 lg:flex-shrink-0">
          {/* Main image */}
          <div className={`relative aspect-square mx-4 lg:mx-0 rounded-2xl overflow-hidden ${isDark ? 'bg-[#141414]' : 'bg-white'}`}>
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-24 h-24 text-emerald-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="7" strokeWidth="1.5"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l2.5 2.5"/>
                  <path strokeLinecap="round" strokeWidth="1.5" d="M9.5 3.5h5M9.5 20.5h5"/>
                </svg>
              </div>
            )}
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.filter(Boolean).length > 1 && (
            <div className="flex gap-2 px-4 lg:px-0 mt-3">
              {images.map((img, i) => img && (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    activeImg === i ? 'border-emerald-500' : isDark ? 'border-[#1f1f1f]' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Product Info */}
        <div className="lg:w-1/2 px-4 lg:px-0 mt-5 lg:mt-0 pb-32 lg:pb-6">

          {/* Category tag */}
          <span className={`text-xs font-medium uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {product.category} watch {product.subcategory ? `· ${product.subcategory}` : ''}
          </span>

          <h1 className={`font-serif text-xl lg:text-3xl font-bold mt-1 mb-3 leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {product.name}
          </h1>

          {/* Pricing */}
          <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${isDark ? 'bg-[#141414]' : 'bg-white'}`}>
            <div>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Price</p>
              <p className="text-emerald-500 font-bold text-2xl lg:text-3xl">৳{Number(product.discount_price).toLocaleString()}</p>
              {product.original_price > product.discount_price && (
                <p className="price-original text-sm">৳{Number(product.original_price).toLocaleString()}</p>
              )}
            </div>
            <div className={`ml-auto pl-4 border-l ${isDark ? 'border-[#2a2a2a]' : 'border-gray-100'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Delivery Fee</p>
              <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {Number(product.delivery_fee) === 0 ? 'Free' : `৳${Number(product.delivery_fee).toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-[#141414]' : 'bg-white'}`}>
              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Details</p>
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {product.description}
              </p>
            </div>
          )}

          {/* Not available notice */}
          {!product.available && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 mb-4 text-center">
              <p className="text-gray-400 text-sm">This product is currently not available</p>
            </div>
          )}

          {/* Desktop buttons — visible only on lg+ */}
          {product.available && (
            <div className="hidden lg:flex gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-xl border font-medium text-sm transition ${
                  isDark ? 'border-emerald-700 text-emerald-400 hover:bg-emerald-900/20' : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Buy Now via WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile buttons — fixed bottom, hidden on lg+ */}
      {product.available && (
        <div className={`lg:hidden fixed bottom-16 left-0 right-0 px-4 pb-3 pt-2 ${isDark ? 'bg-[#0a0a0a]/95 border-t border-[#1f1f1f]' : 'bg-white/95 border-t border-gray-100'} backdrop-blur-sm`}>
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 rounded-xl border font-medium text-sm transition ${
                isDark ? 'border-emerald-700 text-emerald-400 hover:bg-emerald-900/20' : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const [product] = await sql`SELECT * FROM products WHERE id = ${params.id}`;
    if (!product) return { notFound: true };
    return {
      props: {
        product: {
          ...product,
          images: product.images || [],
          original_price: Number(product.original_price),
          discount_price: Number(product.discount_price),
          delivery_fee: Number(product.delivery_fee),
          created_at: product.created_at?.toISOString() || null,
          updated_at: product.updated_at?.toISOString() || null,
        }
      }
    };
  } catch (e) {
    return { notFound: true };
  }
}