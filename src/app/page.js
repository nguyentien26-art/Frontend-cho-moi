'use client';

import { useState, useEffect } from 'react';
import Header from '../global_components/Header';
import Categories from '../global_components/Categories';
import ProductCard from '../global_components/ProductCard';
import Footer from '@/global_components/Footer';
import Banner from '@/global_components/BannerSwipe';
import HeroBanner from '@/global_components/HeroBanner';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:1337/api/products?populate=*', {
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
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Trả lại "sân khấu" cho BannerSwipe của bạn */}
      <Banner />

      <div className="bg-gray-100 mt-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl p-6 bg-white">
            <Categories />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto mt-8 px-4 flex-grow w-full pb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">
          Tin đăng mới nhất
        </h2>

        {loading || products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-400">Đang đợi hàng về từ kho Strapi...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.documentId} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}