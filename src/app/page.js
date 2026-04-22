import Header from '../global_components/Header';
import Categories from '../global_components/Categories';
import ProductCard from '../global_components/ProductCard';
import Footer from '@/global_components/Footer';
import Banner from '@/global_components/BannerSwipe';
import { mockProducts } from '@/lib/data';

// Thay đổi đường dẫn này nếu file bannerswipe.js của bạn nằm ở thư mục khác

async function getProducts() {
  try {
    const res = await fetch('http://localhost:1337/api/products?populate=*', {
      cache: 'no-store' 
    });
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Lỗi:", error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      {/* Trả lại "sân khấu" cho BannerSwipe của bạn */}
      <Banner />

      <main className="max-w-5xl mx-auto mt-8 px-4 flex-grow w-full pb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-3">
          Tin đăng mới nhất
        </h2>

        {products.length === 0 ? (
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