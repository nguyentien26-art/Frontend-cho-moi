"use client";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  const totalPrice = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  return (
    // max-w-4xl và mx-auto giúp gom giỏ hàng vào giữa màn hình
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-bold mb-8 border-b border-gray-600 pb-4">
        Giỏ hàng của bạn
      </h1>
      
      {!cartItems || cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">Giỏ hàng của bạn đang trống 😢</p>
        </div>
      ) : (
        <div className="space-y-5">
          {cartItems.map((item) => (
            // Thẻ bọc từng sản phẩm (Card)
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row items-center justify-between bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700"
            >
              
              {/* Cột trái: Ảnh và Tên sản phẩm */}
              <div className="flex items-center gap-5 w-full sm:w-1/2">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-lg bg-white"
                />
                <div>
                  <h2 className="text-xl font-semibold text-white">{item.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">Phân loại: {item.color}</p>
                  {/* toLocaleString('vi-VN') giúp format số tiền có dấu chấm */}
                  <p className="text-blue-400 font-medium mt-1">
                    {item.price.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>

              {/* Cột giữa: Số lượng */}
              <div className="mt-4 sm:mt-0 font-medium text-lg text-gray-300">
                Số lượng: <span className="text-white font-bold">{item.quantity}</span>
              </div>

              {/* Cột phải: Tổng tiền của món đó & Nút Xóa */}
              <div className="mt-4 sm:mt-0 flex flex-col items-end gap-3 w-full sm:w-auto">
                <span className="font-bold text-red-500 text-xl">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </span>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="px-3 py-1 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  🗑️ Xóa
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Phần tính Tổng tiền cuối cùng */}
      {cartItems && cartItems.length > 0 && (
        <div className="mt-10 bg-gray-800 p-6 rounded-xl flex justify-between items-center border border-gray-700 shadow-lg">
          <span className="text-xl font-semibold text-white">Tổng thanh toán:</span>
          <span className="text-3xl font-bold text-red-500">
            {totalPrice.toLocaleString('vi-VN')} đ
          </span>
        </div>
      )}
    </div>
  );
}