import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('zeitzone_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('zeitzone_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.discount_price * i.qty, 0);
  const cartDeliveryTotal = cart.reduce((sum, i) => sum + (Number(i.delivery_fee) || 0), 0);
  const cartGrandTotal = cartTotal + cartDeliveryTotal;

  const buildWhatsAppMessage = () => {
    const items = cart.map(i => `- ${i.name} x${i.qty} = ৳${(i.discount_price * i.qty).toLocaleString()}`).join('\n');
    return encodeURIComponent(
      `Hello ZEITZONE! I want to order:\n\n${items}\n\nSubtotal: ৳${cartTotal.toLocaleString()}\nDelivery: ৳${cartDeliveryTotal.toLocaleString()}\nTotal: ৳${cartGrandTotal.toLocaleString()}\n\nPlease confirm my order. Thank you!`
    );
  };

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartCount, cartTotal, cartDeliveryTotal, cartGrandTotal,
      isCartOpen, setIsCartOpen, buildWhatsAppMessage
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);