export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10 pt-10 pb-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Về Chợ Mới</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><a href="#" className="hover:text-orange-500 transition">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Quy chế hoạt động</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Tuyển dụng</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Hỗ trợ khách hàng</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><a href="#" className="hover:text-orange-500 transition">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">An toàn mua bán</a></li>
              <li><a href="#" className="hover:text-orange-500 transition">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Tải ứng dụng</h3>
            <div className="flex flex-col space-y-3">
              <button className="bg-gray-100 px-4 py-2 rounded-md text-sm text-left text-gray-700 hover:bg-gray-200 font-medium flex items-center gap-2">
                🍏 <span>Tải trên App Store</span>
              </button>
              <button className="bg-gray-100 px-4 py-2 rounded-md text-sm text-left text-gray-700 hover:bg-gray-200 font-medium flex items-center gap-2">
                🤖 <span>Tải trên Google Play</span>
              </button>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Kết nối với chúng tôi</h3>
            <div className="flex gap-4 text-2xl">
              <span className="cursor-pointer hover:scale-110 transition">📘</span>
              <span className="cursor-pointer hover:scale-110 transition">📸</span>
              <span className="cursor-pointer hover:scale-110 transition">🎵</span>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-6 mt-4">
          <p>© 2026 Chợ Mới. Nền tảng rao vặt trực tuyến mô phỏng.</p>
          <p className="mt-1">Địa chỉ: Quận 1, TP. Hồ Chí Minh, Việt Nam.</p>
        </div>
      </div>
    </footer>
  );
}