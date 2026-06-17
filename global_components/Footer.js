export default function Footer() {
  return (
    <footer className="bg-yellow-400 mt-16">
      {/* App Promotion Section */}
      <div className="bg-yellow-400 px-4 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Ngàn quà tặng dành cho người dùng mới
            </h2>
            <p className="text-gray-700 mb-4">Tải app ngay!</p>
            <div className="flex gap-4">
              <button className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 flex items-center gap-2">
                🍎 App Store
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 flex items-center gap-2">
                📱 Google Play
              </button>
            </div>
          </div>
          <div className="text-center">
            <div className="text-6xl">📱</div>
          </div>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="bg-white px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            {/* App Downloads */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Tải ứng dụng choMỌI</h4>
              <div className="flex flex-col gap-3">
                <div className="border border-gray-300 p-3 rounded bg-gray-50">
                  <div className="text-xs text-gray-600 mb-2">QR Code</div>
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                    📍
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Hỗ trợ khách hàng</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-yellow-500 transition">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">An toàn mua bán</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Liên hệ hỗ trợ</a></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Về choMỌI</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-yellow-500 transition">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Quy chế hoạt động sàn</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Giải quyết tranh chấp</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Truyên thông</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition">Blog</a></li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Liên kết</h4>
              <div className="flex gap-4 text-2xl">
                <a href="#" className="hover:scale-110 transition">f</a>
                <a href="#" className="hover:scale-110 transition">▶️</a>
                <a href="#" className="hover:scale-110 transition">fb</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-gray-800 mb-4">Liên hệ</h4>
              <p className="text-sm text-gray-600 mb-2">
                Email: support@chomoi.vn
              </p>
              <p className="text-sm text-gray-600 mb-2">
                CSHS: 19003003(1000đ/phút)
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Địa chỉ: TP. Hồ Chí Minh, Việt Nam
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2026 choMỌI - Nền tảng chợ đồ cũ trực tuyến
            </p>
            <p className="text-xs text-gray-500 mt-1">
              CÔNG TY TNHH CHỢ MỚI - Người dân điền theo phái luật luật
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}