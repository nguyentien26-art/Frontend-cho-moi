'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  'do-dien-tu': 'Đồ điện tử',
  'do-dung-cho-van-phong': 'Đồ dùng cho văn phòng',
  'giai-tri, the-thao, so-thich': 'Giải trí, thể thao, sở thích',
  'do-an, thuc-pham, va-cac-loai-khac': 'Đồ ăn, thực phẩm, và các loại khác',
};

const subCategoriesMap = {
  'thu-cung': [
    { name: 'Gà', slug: 'ga' },
    { name: 'Chó', slug: 'cho' },
    { name: 'Chim', slug: 'chim' },
    { name: 'Mèo', slug: 'meo' },
    { name: 'Thú cung khác', slug: 'thu-cung-khac' },
    { name: 'Phụ kiện', slug: 'phu-kien' },
    { name: 'Thức ăn', slug: 'thuc-an' },
  ],
  'xe-co': [
    { name: 'Xe máy', slug: 'xe-may' },
    { name: 'Ô tô', slug: 'o-to' },
    { name: 'Xe tải', slug: 'xe-tai' },
    { name: 'Phụ kiện', slug: 'phu-kien' },
  ],
};

// Map slug to type name for API query
const typeMap = {
  'ga': 'Gà',
  'cho': 'Chó',
  'chim': 'Chim',
  'meo': 'Mèo',
  'thu-cung-khac': 'Thú cung khác',
  'phu-kien': 'Phụ kiện',
  'thuc-an': 'Thức ăn',
  'xe-may': 'Xe máy',
  'o-to': 'Ô tô',
  'xe-tai': 'Xe tải',
};

const locations = ['Mèo Con', 'Chó Con', 'Vật', 'Cá Cảnh', 'Thỏ Con'];

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category;
  
  // Kiểm tra xem category có phải là sub-category không
  const allSubs = Object.values(subCategoriesMap).flat().map(s => s.slug);
  const isSubCategory = allSubs.includes(category);
  
  // Lấy category chính
  let mainCategory = category;
  let subCategory = null;
  
  if (isSubCategory) {
    // Tìm category chính chứa sub-category này
    for (const [main, subs] of Object.entries(subCategoriesMap)) {
      if (subs.some(s => s.slug === category)) {
        mainCategory = main;
        subCategory = category;
        break;
      }
    }
  }

  const categoryName = isSubCategory 
    ? `${categoryNameMap[mainCategory]} - ${typeMap[subCategory]}`
    : categoryNameMap[category];

  const subCategories = subCategoriesMap[category] || [];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategory);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  // Price filter
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(30000000);
  const [tempPriceMin, setTempPriceMin] = useState(0);
  const [tempPriceMax, setTempPriceMax] = useState(30000000);
  
  // Modal states
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [showPostedBy, setShowPostedBy] = useState(false);
  const [postedBy, setPostedBy] = useState('all');
  const [searchPostedBy, setSearchPostedBy] = useState('');
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [mainCategory, subCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Query products từ main category
      const res = await fetch(
        `http://localhost:1337/api/products?filters[categories][slug][$eq]=${mainCategory}&populate=*`,
        { cache: 'no-store' }
      );
      
      if (!res.ok) {
        setProducts([]);
        return;
      }
      
      const json = await res.json();
      let allProducts = json.data || [];
      
      // Nếu là sub-category, filter theo type
      if (isSubCategory && subCategory) {
        const typeName = typeMap[subCategory];
        allProducts = allProducts.filter(p => p.type === typeName);
      }
      
      setProducts(allProducts);
    } catch (error) {
      console.error("Lỗi:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (productsToSort) => {
    let filtered = productsToSort.filter(p => {
      const price = p.price || 0;
      return price >= priceMin && price <= priceMax;
    });

    const sorted = [...filtered];
    
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

  const handleResetPrice = () => {
    setTempPriceMin(0);
    setTempPriceMax(30000000);
    setPriceMin(0);
    setPriceMax(30000000);
  };

  const handleApplyAdvanceFilter = () => {
    setPriceMin(tempPriceMin);
    setPriceMax(tempPriceMax);
    setShowAdvanceFilter(false);
  };

  const handleSubCategoryClick = (subSlug) => {
    if (subSlug === 'all') {
      router.push(`/${mainCategory}`);
    } else {
      router.push(`/${subSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-6xl mx-auto text-sm text-gray-600 flex items-center gap-1">
            <button onClick={() => router.push('/')} className="hover:text-blue-500 cursor-pointer">choMỌI</button>
            <span>/</span>
            <button onClick={() => router.push(`/${mainCategory}`)} className="hover:text-blue-500 cursor-pointer">
              {categoryNameMap[mainCategory]}
            </button>
            {isSubCategory && (
              <>
                <span>-</span>
                <span className="font-semibold text-gray-900">{typeMap[subCategory]}</span>
              </>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Category Title and Description */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
            <p className="text-gray-600">Các loại {categoryNameMap[mainCategory]?.toLowerCase()}, vật nuôi thuần chủng, lại tạo giá rẻ</p>
          </div>

          {/* Sub Categories */}
          {subCategories.length > 0 && (
            <div className="bg-white rounded-lg p-4 mb-6 overflow-x-auto">
              <div className="flex gap-3 pb-2 min-w-max md:min-w-0">
                <button
                  onClick={() => handleSubCategoryClick('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    !isSubCategory || !subCategory
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả
                </button>
                {subCategories.map((sub) => (
                  <button
                    key={sub.slug}
                    onClick={() => handleSubCategoryClick(sub.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                      selectedSubCategory === sub.slug
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location Filter - Only show for main categories */}
          {!isSubCategory && (
            <div className="bg-white rounded-lg p-4 mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max md:min-w-0">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(selectedLocation === loc ? null : loc)}
                    className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition ${
                      selectedLocation === loc
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => setShowAdvanceFilter(true)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 flex items-center gap-2"
                >
                  ⚙️ Lọc
                </button>
                <button 
                  onClick={() => setShowPostedBy(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Đăng bởi ▼
                </button>
              </div>

              <div className="flex items-center gap-3">
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
                <button 
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                >
                  {viewMode === 'grid' ? '≣' : '⊞'}
                </button>
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
              <p className="text-gray-400 text-lg">Không có sản phẩm nào</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "flex flex-col gap-4"}>
              {displayProducts.map((product) => (
                <ProductCard key={product.documentId} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Advance Filter Modal */}
      {showAdvanceFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50" onClick={() => setShowAdvanceFilter(false)}>
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Lọc Nâng Cao</h2>
              <button onClick={() => setShowAdvanceFilter(false)} className="text-2xl font-bold text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Price Slider */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Giá</h3>
              <div className="flex gap-4 mb-4">
                <input
                  type="range"
                  min="0"
                  max="30000000"
                  step="100000"
                  value={tempPriceMin}
                  onChange={(e) => setTempPriceMin(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-300 rounded accent-yellow-400 cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="30000000"
                  step="100000"
                  value={tempPriceMax}
                  onChange={(e) => setTempPriceMax(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-300 rounded accent-yellow-400 cursor-pointer"
                />
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  placeholder="Giá tối thiểu"
                  value={tempPriceMin}
                  onChange={(e) => setTempPriceMin(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <span className="text-gray-400 self-center">-</span>
                <input
                  type="number"
                  placeholder="Giá tối đa"
                  value={tempPriceMax}
                  onChange={(e) => setTempPriceMax(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                {tempPriceMin.toLocaleString()} - {tempPriceMax.toLocaleString()} đ
              </div>
            </div>

            {/* Video Filter */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Tin có video</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVideo}
                  onChange={(e) => setHasVideo(e.target.checked)}
                  className="w-5 h-5 rounded accent-yellow-400 cursor-pointer"
                />
                <span className="text-gray-700">Có video</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 sticky bottom-0 bg-white pt-4">
              <button
                onClick={handleResetPrice}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
              >
                Xóa lọc
              </button>
              <button
                onClick={handleApplyAdvanceFilter}
                className="flex-1 px-4 py-3 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posted By Modal */}
      {showPostedBy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50" onClick={() => setShowPostedBy(false)}>
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Đăng bởi</h2>
              <button onClick={() => setShowPostedBy(false)} className="text-2xl font-bold text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Nhập tìm đăng bởi"
              value={searchPostedBy}
              onChange={(e) => setSearchPostedBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-6 focus:outline-none focus:border-blue-500"
            />

            {/* Options */}
            <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
              {['Cá nhân', 'Bán chuyên', 'Đối Tác Chợ Tốt'].map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input
                    type="radio"
                    name="postedBy"
                    value={option}
                    checked={postedBy === option}
                    onChange={(e) => setPostedBy(e.target.value)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>

            {/* Button */}
            <button
              onClick={() => setShowPostedBy(false)}
              className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
            >
              Xóa Lọc
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
