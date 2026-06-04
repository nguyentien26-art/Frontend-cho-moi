import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';
import ProductCard from '@/global_components/ProductCard'; // Tận dụng lại component có sẵn
import { mockProducts } from '@/lib/data';

export default async function ProductDetail({ params }) {
  const { id } = await params;
  
  // 1. Tìm sản phẩm hiện tại
  const product = mockProducts.find(p => p.documentId === id);

  if (!product) {
    return <div className="p-10 text-center">Sản phẩm không tồn tại.</div>;
  }

  // 2. Lấy danh sách tin đăng tương tự (Bỏ qua sản phẩm hiện tại)
  const similarProducts = mockProducts
    .filter(p => p.documentId !== id)
    .slice(0, 4); // Lấy tối đa 4 tin

  const imageUrl = product.image?.url.startsWith('http') 
    ? product.image.url 
    : `http://localhost:1337${product.image.url}`;

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND'
  }).format(product.price);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="max-w-6xl mx-auto py-6 px-4 w-full flex-grow">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* --- CỘT TRÁI (70%) --- */}
          <div className="lg:w-2/3 space-y-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative h-[350px] md:h-[450px] bg-white flex items-center justify-center">
                <img 
                  src={imageUrl} 
                  alt={product.title} 
                  className="max-h-full max-w-full object-contain p-2"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 leading-tight">
                {product.title}
              </h1>
              <p className="text-2xl font-bold text-orange-600 mb-4">{formattedPrice}</p>
              
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-y-2 border-t pt-4">
                <span className="mr-4 flex items-center gap-1">📍 {product.location}</span>
                <span className="flex items-center gap-1">🕒 Mới đăng</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Mô tả chi tiết</h3>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed text-sm md:text-base">
                {product.description}
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI (30%) --- */}
          <div className="lg:w-1/3 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                  {product.seller?.name?.charAt(0) || "C"}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{product.seller?.name || "Cửa hàng Demo"}</h4>
                  <p className="text-xs text-gray-500">Phản hồi trong vài phút</p>
                </div>
              </div>

              <div className="space-y-3">
                <a 
                  href={`tel:${product.seller?.phone}`}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  📞 {product.seller?.phone || "Gọi điện ngay"}
                </a>
                <button className="w-full border-2 border-orange-500 text-orange-600 py-3 rounded-lg font-bold hover:bg-orange-50 transition">
                  NHẮN TIN CHAT
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Đánh giá:</span>
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- PHẦN TIN ĐĂNG TƯƠNG TỰ --- */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
              Tin đăng tương tự
            </h2>
            <div className="h-1 flex-grow mx-4 bg-gray-200 rounded-full hidden md:block"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((item) => (
              <ProductCard key={item.documentId} product={item} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}