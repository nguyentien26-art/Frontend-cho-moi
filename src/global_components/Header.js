"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { getUserData, getAuthToken, removeAuthToken, removeUserData, canModerate, getMyProfile } from '@/lib/strapiAuth';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Danh mục');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState(0);

  const categories = [
    'Danh mục',
    'Xe cộ',
    'Bất động sản',
    'Đồ điện tử',
    'Thời trang, đồ dùng cá nhân',
    'Đồ gia dụng, nội thất, cây cảnh',
    'Đồ dùng cho văn phòng',
    'Giải trí, thể thao, sở thích',
    'Đồ ăn, thực phẩm, và các loại khác',
  ];

  useEffect(() => {
    // Check authentication status on mount
    const token = getAuthToken();
    const userData = getUserData();
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
      
      // Fetch user profile to get balance
      fetchBalance();
    }
  }, []);

  const fetchBalance = async () => {
    try {
      const profileData = await getMyProfile();
      if (profileData) {
        setBalance(profileData.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    removeUserData();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const { cartItems } = useCart();
  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-yellow-400 sticky top-0 z-50 shadow-md">
      {/* Top Bar */}
      <div className="bg-yellow-400 px-4 py-2 border-b border-yellow-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex gap-6 text-gray-700">
            <span className="hover:text-gray-900 cursor-pointer">Dành cho người bán ▼</span>
            <span className="hover:text-gray-900 cursor-pointer">Chợ MỌI</span>
            <span className="hover:text-gray-900 cursor-pointer">Xe cộ</span>
            <span className="hover:text-gray-900 cursor-pointer">Bất động sản</span>
            <span className="hover:text-gray-900 cursor-pointer">Đồ Điện Tử</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-gray-900 cursor-pointer">♥️ Yêu thích</span>
            <span className="hover:text-gray-900 cursor-pointer">🔔 Thông báo</span>
            <span className="hover:text-gray-900 cursor-pointer">👤 Liên hệ</span>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Xin chào, {user?.username || 'User'}</span>
                <span 
                  className="text-green-600 font-semibold cursor-pointer hover:text-green-700"
                  onClick={() => router.push('/wallet')}
                >
                  💰 {balance.toLocaleString('vi-VN')}đ
                </span>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-900 cursor-pointer font-semibold"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="hover:text-gray-900 cursor-pointer font-semibold"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <h1
              onClick={() => router.push('/')}
              className="text-3xl font-bold text-black cursor-pointer hover:opacity-80 transition flex items-center gap-2"
            >
              🛒 choMỌI
            </h1>

            {/* Search Bar */}
            <div className="flex-1 mx-8 flex gap-2">
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="bg-white px-4 py-2 rounded-l-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
                >
                  {selectedCategory} ▼
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-48 z-10">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-yellow-100 cursor-pointer text-gray-700"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="flex-1 px-4 py-2 bg-white outline-none text-gray-700"
              />

              {/* Search Button */}
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="bg-yellow-500 px-6 py-2 text-gray-700 font-semibold hover:bg-yellow-600 rounded-r-md"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Right Actions */}
            {isAuthenticated && canModerate() ? (
              <button
                onClick={() => router.push('/moderation')}
                className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 ml-4"
              >
                🔍 Kiểm duyệt
              </button>
            ) : (
              <button
                onClick={() => router.push('/post')}
                className="bg-yellow-500 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-yellow-600 ml-4"
              >
                + Đăng tin
              </button>
            )}
          </div>

          {/* Location Bar */}
          {/* <div className="flex items-center gap-4 text-sm text-gray-700">
            <span className="flex items-center gap-2">
              📍 Chọn khu vực ▼
            </span>
          </div> */}

          {/* Cart */}
          <nav>
              <Link href="/cart">🛒 Giỏ hàng ({totalQty})</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}