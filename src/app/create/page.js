"use client";

import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';

export default function CreatePost() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("🎉 Chúc mừng! Tin của bạn đã được đăng thành công (Giao diện ảo).");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="max-w-3xl mx-auto mt-6 px-4 flex-grow w-full pb-10">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            📝 Đăng tin mới
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Khu vực tải ảnh */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-orange-50 hover:border-orange-300 transition cursor-pointer">
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
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal" 
              />
            </div>

            {/* Danh mục & Giá */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select required className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white cursor-pointer transition text-gray-900 font-medium">
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
                  className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal" 
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
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition resize-y text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
              ></textarea>
            </div>

            {/* Nút Submit */}
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-orange-500 text-white font-bold text-lg py-4 rounded-md hover:bg-orange-600 transition shadow-md active:transform active:scale-[0.99]"
              >
                🚀 Đăng tin ngay
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}