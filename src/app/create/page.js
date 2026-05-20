"use client";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  const totalPrice = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-bold mb-8 border-b border-gray-300 pb-4 text-gray-800">
        Giỏ hàng của bạn
      </h1>
      
<<<<<<< HEAD
      {!cartItems || cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Giỏ hàng của bạn đang trống 😢</p>
=======
      <main className="max-w-3xl mx-auto mt-6 px-4 flex-grow w-full pb-10">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            📝 Đăng tin mới
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Khu vực tải ảnh */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-yellow-50 hover:border-yellow-400 transition cursor-pointer">
                <span className="text-5xl mb-3 block">📸</span>
                <p className="text-gray-600 font-medium">Bấm vào đây để tải ảnh lên</p>
                <p className="text-gray-400 text-sm mt-1">Hỗ trợ định dạng JPG, PNG (Tối đa 6 ảnh)</p>
              </div>
            </div>

            {/* Tiêu đề */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Tiêu đề tin đăng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Xe Honda Wave Alpha 2021 chính chủ"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>

            {/* Danh mục & Giá */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select required className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-white cursor-pointer transition text-gray-900 font-medium">
                  <option value="" className="text-gray-500">-- Chọn danh mục --</option>
                  <option value="bat-dong-san">Bất động sản</option>
                  <option value="xe-co">Xe cộ</option>
                  <option value="do-dien-tu">Đồ điện tử</option>
                  <option value="viec-lam">Việc làm</option>
                </select>
              </div>
              
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ví dụ: 15000000"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Khu vực */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Khu vực <span className="text-red-500">*</span>
              </label>
              <select required className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white cursor-pointer transition text-gray-900 font-medium">
                <option value="" className="text-gray-500">-- Chọn tỉnh/thành phố --</option>
                <option value="ha-noi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="da-nang">Đà Nẵng</option>
                <option value="can-tho">Cần Thơ</option>
              </select>
            </div>

            {/* Mô tả chi tiết */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows="6"
                placeholder="Mô tả tình trạng, xuất xứ, thời gian sử dụng, phụ kiện đi kèm..."
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition resize-y text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
              ></textarea>
            </div>

            {/* Nút Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-yellow-400 text-gray-800 font-bold text-lg py-4 rounded-md hover:bg-yellow-500 transition shadow-md active:transform active:scale-[0.99]"
              >
                🚀 Đăng tin ngay
              </button>
            </div>
          </form>
>>>>>>> e796dd594c2bf200056cfcd5b396780ccb625f00
        </div>
      ) : (
        <div className="space-y-5">
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              
              {/* Cột trái */}
              <div className="flex items-center gap-5 w-full sm:w-1/2">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">Phân loại: {item.color}</p>
                  <p className="text-blue-600 font-medium mt-1">
                    {item.price.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>

              {/* Cột giữa */}
              <div className="mt-4 sm:mt-0 font-medium text-lg text-gray-600">
                Số lượng: <span className="text-gray-900 font-bold">{item.quantity}</span>
              </div>

              {/* Cột phải */}
              <div className="mt-4 sm:mt-0 flex flex-col items-end gap-3 w-full sm:w-auto">
                <span className="font-bold text-red-500 text-xl">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </span>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  🗑️ Xóa
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Tổng tiền */}
      {cartItems && cartItems.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-xl flex justify-between items-center border border-gray-200 shadow-md">
          <span className="text-xl font-semibold text-gray-800">Tổng thanh toán:</span>
          <span className="text-3xl font-bold text-red-500">
            {totalPrice.toLocaleString('vi-VN')} đ
          </span>
        </div>
      )}
    </div>
  );
}