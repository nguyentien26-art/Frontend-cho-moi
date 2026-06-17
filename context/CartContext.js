"use client";
import { createContext, useContext, useState } from "react";
import { mockCartdata } from "@/lib/CartItems";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(mockCartdata);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const productId = product.documentId || product.id; 
      const exist = prev.find((item) => (item.documentId || item.id) === productId);
      
      if (exist) {
        return prev.map((item) =>
          (item.documentId || item.id) === productId 
            ? { ...exist, quantity: exist.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => (item.documentId || item.id) !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);