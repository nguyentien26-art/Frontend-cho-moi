"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Header from "@/global_components/Header";
import Footer from "@/global_components/Footer";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header màu vàng đồng bộ với trang chủ */}
      <Header />
      
      <main className="max-w-4xl mx-auto my-10 px-4 flex-grow w-full">
        {/* Nút Quay lại trang trước */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-black font-semibold mb-6 transition group text-sm"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> 
          Quay lại trang trước
        </button>

        {/* Khung nội dung giỏ hàng sáng sủa, đồng bộ */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
            🛒 Giỏ hàng của bạn
          </h1>
          
          {!cartItems || cartItems.length === 0 ? (
            /* TRẠNG THÁI GIỎ HÀNG TRỐNG */
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">🛍️</span>
              <p className="text-gray-500 mb-6 text-base">Giỏ hàng của bạn đang trống.</p>
              <button 
                onClick={() => router.push('/')}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded-xl transition shadow-sm text-sm"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            /* DANH SÁCH SẢN PHẨM TRONG GIỎ */
            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemId = item.documentId || item.id;
                
                // Sửa lỗi hiển thị ảnh: Tự động nhận diện chuỗi hoặc object từ Strapi
                const imageUrl = typeof item.image === 'string' 
                  ? item.image 
                  : (item.image?.url?.startsWith('http') ? item.image.url : `http://localhost:1337${item.image?.url || ''}`);

                return (
                  <div 
                    key={itemId} 
                    className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-yellow-300 transition duration-200 gap-4"
                  >
                    {/* Cột trái: Thông tin sản phẩm (Nhấp vào sẽ dẫn sang trang chi tiết) */}
                    <Link href={`/product/${itemId}`} className="flex items-center gap-4 w-full sm:w-7/12 group cursor-pointer">
                      <img 
                        src={imageUrl || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"} 
                        alt={item.title || item.name} 
                        className="w-20 h-20 object-cover rounded-xl bg-white border border-gray-200 group-hover:scale-105 transition duration-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base font-semibold text-gray-900 group-hover:text-yellow-600 transition truncate">
                          {item.title || item.name}
                        </h2>
                        <p className="text-gray-500 text-xs mt-0.5">Phân loại: {item.color || "Tiêu chuẩn"}</p>
                        <p className="text-blue-600 font-medium text-sm mt-1">
                          {(item.price || 0).toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                    </Link>

                    {/* Cột giữa: Số lượng */}
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      Số lượng: <span className="text-gray-900 font-bold bg-white px-3 py-1 rounded-md border border-gray-200">{item.quantity}</span>
                    </div>

                    {/* Cột phải: Tổng tiền & Nút xóa */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      <span className="font-bold text-red-600 text-base">
                        {((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')} đ
                      </span>
                      <button 
                        onClick={() => removeFromCart(itemId)} 
                        className="text-xs px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition duration-200 flex items-center gap-1"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* PHẦN TỔNG TIỀN & NÚT THANH TOÁN MÀU VÀNG CHỢ MỌI */}
              <div className="mt-8 bg-gray-50 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-center border border-gray-100 gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-sm text-gray-500 font-medium block">Tổng chi phí thanh toán:</span>
                  <span className="text-2xl font-black text-red-600">
                    {cartTotal.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <Link 
                  href="/checkout"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-xl transition shadow-sm text-center w-full sm:w-auto text-sm tracking-wide"
                >
                  TIẾN HÀNH THANH TOÁN →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}