"use client";

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleSearch = (e) => {
    // Nếu người dùng nhấn phím Enter (mã phím là 'Enter')
    if (e.key === 'Enter') {
      router.push('/search');
    }
  };

  return (
    <header className="bg-yellow-400 p-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto flex gap-4 justify-between items-center">
        
        {/* Logo - Click để về trang chủ */}
        <h1 
          onClick={() => router.push('/')}
          className="text-2xl font-bold text-black tracking-tight cursor-pointer hover:opacity-80 transition"
        >
          🛒 Chợ Mới
        </h1>
        
        {/* Thanh tìm kiếm */}
        <div className="flex-1 max-w-xl flex items-center bg-white rounded-md px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-orange-500 transition">
          <span className="text-gray-400 mr-2">🔍</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm xe máy, điện thoại, nhà đất... (Nhấn Enter)" 
            className="w-full outline-none text-sm text-black bg-transparent"
            onKeyDown={handleSearch}
          />
        </div>
        
        {/* Nút Đăng tin */}
        <button 
          onClick={() => router.push('/create')}
          className="bg-orange-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600 transition shadow-sm hidden md:flex items-center gap-2"
        >
          📝 Đăng tin
        </button>

      </div>
    </header>
  );
}