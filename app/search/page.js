"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';
import ProductCard from '@/global_components/ProductCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Toàn quốc');

  const categories = [
    'Bất động sản',
    'Xe cộ',
    'Đồ điện tử',
    'Thú cưng',
    'Thời trang, đồ dùng cá nhân',
    'Đồ gia dụng, nội thất, cây cảnh',
    'Đồ dùng cho văn phòng',
    'Giải trí, thể thao, sở thích',
    'Đồ ăn, thực phẩm, và các loại khác',
  ];

  const priceRanges = [
    { label: 'Dưới 2 triệu', min: 0, max: 2000000 },
    { label: '2 - 5 triệu', min: 2000000, max: 5000000 },
    { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
    { label: 'Trên 10 triệu', min: 10000000, max: null },
  ];

  const locations = ['Toàn quốc', 'ha-noi', 'hcm', 'da-nang'];
  const locationLabels = {
    'Toàn quốc': 'Toàn quốc',
    'ha-noi': 'Hà Nội',
    'hcm': 'TP. Hồ Chí Minh',
    'da-nang': 'Đà Nẵng',
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(prev => prev === range ? '' : range);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:1337/api/products?filters[productStatus][$eq]=approved&populate=*';
        
        // Thêm filter tìm kiếm theo tên nếu có query
        if (query) {
          url += `&filters[name][$containsi]=${encodeURIComponent(query)}`;
        }

        // Thêm filter theo categories nếu có chọn
        if (selectedCategories.length > 0) {
          selectedCategories.forEach(cat => {
            url += `&filters[categories][name][$eq]=${encodeURIComponent(cat)}`;
          });
        }

        // Thêm filter theo mức giá nếu có chọn
        if (selectedPriceRange) {
          const range = priceRanges.find(r => r.label === selectedPriceRange);
          if (range) {
            if (range.min !== null) {
              url += `&filters[price][$gte]=${range.min}`;
            }
            if (range.max !== null) {
              url += `&filters[price][$lte]=${range.max}`;
            }
          }
        }

        // Thêm filter theo khu vực nếu có chọn
        if (selectedLocation && selectedLocation !== 'Toàn quốc') {
          url += `&filters[location][$containsi]=${encodeURIComponent(selectedLocation)}`;
        }

        const res = await fetch(url, {
          cache: 'no-store'
        });
        
        if (!res.ok) {
          console.error("Lỗi fetch:", res.status);
          setProducts([]);
          return;
        }
        
        const json = await res.json();
        setProducts(json.data || []);
      } catch (error) {
        console.error("Lỗi:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, selectedCategories, selectedPriceRange, selectedLocation]);

  return (
    <main className="max-w-7xl mx-auto mt-6 px-4 flex-grow w-full pb-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">
          {query ? `Kết quả tìm kiếm cho "${query}"` : 'Tất cả sản phẩm'}
        </h1>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-white cursor-pointer hover:border-yellow-500 transition">
          <option>Tin mới nhất</option>
          <option>Giá thấp đến cao</option>
          <option>Giá cao đến thấp</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-[250px] bg-white p-4 rounded-lg shadow-sm h-fit shrink-0">
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
              Danh mục
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                  <input 
                    type="checkbox" 
                    className="accent-yellow-400 w-4 h-4"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  /> {category}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
              Mức giá
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              {priceRanges.map((range) => (
                <label key={range.label} className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                  <input 
                    type="checkbox" 
                    className="accent-yellow-400 w-4 h-4"
                    checked={selectedPriceRange === range.label}
                    onChange={() => handlePriceRangeChange(range.label)}
                  /> {range.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
              Khu vực
            </h3>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-white cursor-pointer hover:border-yellow-500 transition"
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              {locations.map((location) => (
                <option key={location} value={location}>{locationLabels[location]}</option>
              ))}
            </select>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-400 text-lg">Đang tải...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-400 text-lg">Không có sản phẩm nào</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center"><p>Đang tải...</p></div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}