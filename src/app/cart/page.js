"use client";

import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';
import { useRouter } from 'next/navigation';
// 1. Import dữ liệu cứng mockCartdata từ file lib của bạn
import { mockCartdata } from "@/lib/CartItems"; 

export default function CartPage() {
  const router = useRouter();

  // 2. Sử dụng trực tiếp dữ liệu cứng từ file lib
  const cartItems = mockCartdata || []; 

  // 3. Tính tổng tiền thanh toán dựa trên dữ liệu cứng
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto my-8 px-4 flex-grow w-full">
        {/* NÚT QUAY LẠI NẰM Ở ĐẦU TRANG GIỎ HÀNG */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold mb-4 transition group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> 
          Quay lại trang trước
        </button>

        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
            🛒 Giỏ hàng của bạn
          </h1>

          {cartItems.length === 0 ? (
            /* TRẠNG THÁI GIỎ HÀNG TRỐNG */
            <div className="text-center py-10">
              <span className="text-6xl mb-4 block">🛍️</span>
              <p className="text-gray-500 mb-6 text-lg">Giỏ hàng của bạn đang trống.</p>
              <button 
                onClick={() => router.push('/')}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold px-6 py-3 rounded-md transition shadow-sm"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            /* TRẠNG THÁI CÓ SẢN PHẨM (HIỂN THỊ DỮ LIỆU CỨNG) */
            <div className="space-y-6">
              <p className="text-gray-600 font-medium">Bạn đang có {cartItems.length} sản phẩm trong giỏ hàng.</p>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm"
                  >
                    {/* Cột trái: Ảnh và Tên sản phẩm */}
                    <div className="flex items-center gap-5 w-full sm:w-1/2">
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-lg bg-white border border-gray-200"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.name}</h2>
                        <p className="text-gray-500 text-sm mt-0.5">Phân loại: {item.color || "Tiêu chuẩn"}</p>
                        <p className="text-blue-600 font-medium mt-0.5">
                          {(item.price || 0).toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                    </div>

                    {/* Cột giữa: Số lượng */}
                    <div className="mt-3 sm:mt-0 font-medium text-gray-600">
                      Số lượng: <span className="text-gray-900 font-bold">{item.quantity}</span>
                    </div>

                    {/* Cột phải: Tổng tiền món đó & Nút Xóa giả lập */}
                    <div className="mt-3 sm:mt-0 flex flex-col items-end gap-2 w-full sm:w-auto">
                      <span className="font-bold text-red-600 text-lg">
                        {((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')} đ
                      </span>
                      <button 
                        onClick={() => alert(`Chức năng xóa item ${item.id} đang được kết nối với Context`)}
                        className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-all duration-200 border border-red-200"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phần tính Tổng tiền cuối cùng */}
              <div className="mt-8 bg-gray-50 p-6 rounded-xl flex justify-between items-center border border-gray-200 shadow-sm">
                <span className="text-lg font-semibold text-gray-800">Tổng thanh toán:</span>
                <span className="text-2xl font-bold text-red-600">
                  {totalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}