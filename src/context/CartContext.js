"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { mockCartdata } from "@/lib/CartItems"
const CartContext = createContext();

export const CartProvider = ({ children }) => {

console.log("DỮ LIỆU GỐC TỪ FILE CARTITEMS:", mockCartdata);

  const [cartItems, setCartItems] = useState(mockCartdata);
  

  // useEffect(() => {
  //   const savedCart = localStorage.getItem("cart");
  //   if (savedCart) setCartItems(JSON.parse(savedCart));
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("cart", JSON.stringify(cartItems));
  // }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);