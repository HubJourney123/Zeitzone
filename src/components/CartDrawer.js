import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const WA_NUMBER = '8801795818784';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty, cartTotal, cartDeliveryTotal, cartGrandTotal, cartCount, buildWhatsAppMessage, clearCart } = useCart();
  const { isDark } = useTheme();

  if (!isCartOpen) return null;

  const handleWhatsApp = () => {
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col slide-in ${
        isDark ? 'bg-[#0f0f0f] border-l border-[#1f1f1f]' : 'bg-white border-l border-gray-200'
      }`} style={{ animation: 'slideInRight 0.3s ease' }}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-[#1f1f1f]' : 'border-gray-100'}`}>
          <div>
            <h2 className={`font-serif text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Cart</h2>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setIsCartOpen(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#1f1f1f] text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <svg className={`w-16 h-16 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className={`flex gap-3 p-3 rounded-xl ${isDark ? 'bg-[#141414] border border-[#1f1f1f]' : 'bg-gray-50 border border-gray-200'}`}>
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#0a0a0a]">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="7" strokeWidth="1.5"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l2.5 2.5"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                    <p className="text-emerald-500 text-sm font-bold">৳{Number(item.discount_price).toLocaleString()}</p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      Delivery: {Number(item.delivery_fee) === 0 ? 'Free' : `৳${Number(item.delivery_fee).toLocaleString()}`}
                    </p>
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>−</button>
                      <span className={`text-sm font-medium w-5 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>+</button>
                    </div>
                  </div>
                  {/* Remove */}
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 p-1 self-start">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className={`p-4 border-t ${isDark ? 'border-[#1f1f1f]' : 'border-gray-100'}`}>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Subtotal</span>
              <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>৳{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Delivery</span>
              <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {cartDeliveryTotal === 0 ? 'Free' : `৳${cartDeliveryTotal.toLocaleString()}`}
              </span>
            </div>
            <div className={`flex justify-between mb-4 pt-2 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-100'}`}>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total</span>
              <span className="font-bold text-emerald-500 text-lg">৳{cartGrandTotal.toLocaleString()}</span>
            </div>
            <button
              onClick={handleWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </button>
            <button onClick={clearCart} className={`w-full mt-2 text-xs py-2 ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'} transition`}>
              Clear Cart
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}