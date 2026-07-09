import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getCartKey = () => user ? `cart_${user._id}` : "cart_guest";

  useEffect(() => {
    if (loading) return;
    const saved = localStorage.getItem(getCartKey());
    if (saved) {
      setCart(JSON.parse(saved));
    } else {
      setCart([]);
    }
  }, [user, loading]);

  const saveCart = (newCart) => {
    localStorage.setItem(getCartKey(), JSON.stringify(newCart));
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      let newCart;
      if (existing) {
        newCart = prev.map(item => 
          item._id === product._id ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: qty }];
      }
      saveCart(newCart);
      return newCart;
    });
    setIsSidebarOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const newCart = prev.filter(item => item._id !== id);
      saveCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart(prev => {
      const newCart = prev.map(item => 
        item._id === id ? { ...item, quantity } : item
      );
      saveCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isSidebarOpen,
      toggleSidebar,
      setIsSidebarOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
