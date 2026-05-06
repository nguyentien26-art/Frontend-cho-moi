'use client';

import { useState, useEffect } from 'react';
import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';
import ProductCard from '@/global_components/ProductCard';
import { useParams } from 'next/navigation';

const categoryNameMap = {
  'bat-dong-san': 'Bất động sản',
  'xe-co': 'Xe cộ',
  'do-dien-tu': 'Đồ điện tử',
  'thu-cung': 'Thú cưng',
  'do-gia-dung, noi that, cay canh': 'Đồ gia dụng  - Nội thất - Cây cảnh',
  'thoi-trang, do-dung-ca-nhan': 'Thời trang, đồ dùng cá nhân',
  'do-dung-cho-van-phong': 'Đồ dùng cho văn phòng',
  'giai-tri, the-thao, so-thich': 'Giải trí, thể thao, sở thích',
  'do-an, thuc-pham, va-cac-loai-khac': 'Đồ ăn, thực phẩm, và các loại khác',
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category;
  const categoryName = categoryNameMap[category] || category;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Filter sản phẩm theo category slug (relationship)
      const res = await fetch(
        `http://localhost:1337/api/products?filters[categories][slug][$eq]=${category}&populate=*`,
        { cache: 'no-store' }
      );
      
      if (!res.ok) {
        setProducts([]);
        return;
      }
      
      const json = await res.json();
      const allProducts = json.data || [];
      setProducts(allProducts);
    } catch (error) {
      console.error("Lỗi:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (productsToSort) => {
    const sorted = [...productsToSort];
    
    switch(sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
      default:
        return sorted.reverse();
    }
  };

  const displayProducts = sortProducts(products);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-grow">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-600">
            Các loại {categoryName.toLowerCase()}, vật nuôi thuần chủng, lại tạo giá rẻ
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === 'all' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setFilter('verified')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === 'verified' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cá nhân
              </button>
              <button 
                onClick={() => setFilter('shop')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === 'shop' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Bán chuyên
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 font-medium">Sắp xếp:</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="newest">Tin mới nhất</option>
                <option value="price-low">Giá: Thấp đến cao</option>
                <option value="price-high">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Đang tải sản phẩm...</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <p className="text-gray-400">Không có sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.documentId} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
