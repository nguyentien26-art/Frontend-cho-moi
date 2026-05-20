"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroBanner() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState('Chọn khu vực');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const locations = [
    'Chọn khu vực',
    'Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng'
  ];

  return (
    <section className="bg-yellow-400 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Giá tốt, gần bạn, chốt nhanh!
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Tìm kiếm, so sánh và mua bán hàng cũ dễ dàng
            </p>

            {/* Search Bar */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-2">
              {/* Location Dropdown */}
              <div className="relative md:w-1/3">
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="w-full bg-white px-4 py-3 rounded-l-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 flex items-center gap-2 justify-between"
                >
                  📍 {selectedLocation}
                  <span>▼</span>
                </button>
                {showLocationDropdown && (
                  <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full z-10">
                    {locations.map((loc) => (
                      <div
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-yellow-100 cursor-pointer text-gray-700"
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={() => router.push('/search')}
                className="bg-yellow-500 text-gray-800 px-6 py-3 rounded-r-md md:rounded-md font-semibold hover:bg-yellow-600 transition"
              >
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="text-6xl text-center">
            🏪 💰 📦
          </div>
        </div>
      </div>
    </section>
  );
}
