import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function WatchCard({ product }) {
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  const discount = Math.round(
    ((product.original_price - product.discount_price) / product.original_price) * 100
  );

  const image = product.images?.[0] || null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`, {
      style: {
        background: isDark ? '#141414' : '#fff',
        color: isDark ? '#fff' : '#1a1a1a',
        border: '1px solid #059669',
      },
    });
  };

  const CardContent = () => (
    <div className={`rounded-xl overflow-hidden transition-transform duration-200 ${
      product.available ? 'hover:scale-[1.02] cursor-pointer' : 'opacity-60 cursor-default'
    } ${isDark ? 'bg-[#141414] border border-[#1f1f1f]' : 'bg-white border border-gray-200 shadow-sm'}`}>
      {/* Image */}
      <div className="relative aspect-square bg-[#0f0f0f] overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-emerald-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="7" strokeWidth="1.5"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l2.5 2.5"/>
              <path strokeLinecap="round" strokeWidth="1.5" d="M9.5 3.5h5M9.5 20.5h5"/>
            </svg>
          </div>
        )}
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {/* Not Available Badge */}
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
              Not Available
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className={`text-sm font-medium leading-tight mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-emerald-500 font-bold text-base">
            ৳{Number(product.discount_price).toLocaleString()}
          </span>
          {product.original_price > product.discount_price && (
            <span className="price-original text-xs">
              ৳{Number(product.original_price).toLocaleString()}
            </span>
          )}
        </div>
        {product.available && (
          <button
            onClick={handleAddToCart}
            className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white text-xs font-medium py-2 rounded-lg transition-all duration-150"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );

  if (!product.available) {
    return <CardContent />;
  }

  return (
    <Link href={`/product/${product.id}`} className="block">
      <CardContent />
    </Link>
  );
}
