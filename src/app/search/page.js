"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';
import ProductCard from '@/global_components/ProductCard';
import { mockProducts } from '@/lib/data';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

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
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="checkbox" className="accent-yellow-400 w-4 h-4" /> Bất động sản
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="checkbox" className="accent-yellow-400 w-4 h-4" /> Xe cộ
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="checkbox" className="accent-yellow-400 w-4 h-4" /> Đồ điện tử
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="checkbox" className="accent-yellow-400 w-4 h-4" /> Thú cưng
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="checkbox" className="accent-yellow-400 w-4 h-4" /> Thời trang, đồ dùng cá nhân
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="checkbox" className="accent-yellow-400 w-4 h-4" /> Đồ gia dụng, nội thất, cây cảnh
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="checkbox" className="accent-yellow-400 w-4 h-4" /> Đồ dùng cho văn phòng
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="checkbox" className="accent-yellow-400 w-4 h-4" /> Giải trí, thể thao, sở thích
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="checkbox" className="accent-yellow-400 w-4 h-4" /> Đồ ăn, thực phẩm, và các loại khác
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
              Mức giá
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="radio" name="price" className="accent-yellow-400 w-4 h-4" /> Dưới 2 triệu
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="radio" name="price" className="accent-yellow-400 w-4 h-4" /> 2 - 5 triệu
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500">
                <input type="radio" name="price" className="accent-yellow-400 w-4 h-4" /> Trên 5 triệu
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
              Khu vực
            </h3>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-white cursor-pointer hover:border-yellow-500 transition">
              <option>Toàn quốc</option>
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
            </select>
          </div>
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {mockProducts.length > 0 ? (
              mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg">
                <p className="text-gray-400 text-lg">Không có sản phẩm nào</p>
              </div>
            )}
          </div>
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