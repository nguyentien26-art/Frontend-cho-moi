import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';

async function getSingleProduct(documentId) {
  try {
    const res = await fetch(`http://localhost:1337/api/products/${documentId}?populate=*`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error("Lỗi từ Strapi:", res.statusText);
      return null;
    }

    const json = await res.json();
    // Strapi v5 trả về đối tượng nằm trực tiếp trong json.data
    return json.data;
  } catch (error) {
    console.error("Lỗi fetch:", error);
    return null;
  }
}

// Next.js 15 yêu cầu params phải được awaited
export default async function ProductDetail({ params }) {
  // BƯỚC QUAN TRỌNG: Await params trước khi lấy id
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = await getSingleProduct(id);

  // Nếu không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Oops! Không tìm thấy sản phẩm</h2>
            <p className="text-gray-500 mt-2">Sản phẩm này có thể đã bị xóa hoặc lỗi kết nối.</p>
            <a href="/" className="inline-block mt-4 text-yellow-500 font-semibold underline">Quay lại trang chủ</a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Xử lý ảnh
  const imageUrl = product.image?.url 
    ? `http://localhost:1337${product.image.url}` 
    : 'https://via.placeholder.com/800x600?text=Khong+co+anh';

  // Format giá
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND'
  }).format(product.price);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="max-w-5xl mx-auto py-6 px-4 w-full flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          
          {/* Ảnh bên trái */}
          <div className="rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={product.title} 
              className="w-full h-auto object-contain max-h-[500px]" 
            />
          </div>

          {/* Thông tin bên phải */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {product.title}
            </h1>
            <p className="text-3xl font-extrabold text-yellow-600 mb-6">
              {formattedPrice}
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
              <p className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                📝 Mô tả sản phẩm
              </p>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center text-gray-600">
                <span className="text-xl mr-2">📍</span>
                <span className="font-medium">{product.location || 'Toàn quốc'}</span>
              </div>
              
              <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-2">
                <span>📞</span> Liên hệ người bán
              </button>
              <button className="w-full bg-yellow-400 text-gray-800 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition flex items-center justify-center gap-2">
                <span>❤️</span> Yêu thích
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}