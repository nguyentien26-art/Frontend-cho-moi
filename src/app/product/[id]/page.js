import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';
import ProductCard from '@/global_components/ProductCard';

export default async function ProductDetail({ params }) {
  const { id } = await params;

  // 1. Lấy sản phẩm từ Strapi API
  let product = null;
  try {
    const res = await fetch(`http://localhost:1337/api/products?filters[documentId][$eq]=${id}&populate=*`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      product = data.data[0];
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }

  if (!product) {
    return <div className="p-10 text-center">Sản phẩm không tồn tại.</div>;
  }

  // Helper function to safely get string value
  const getStringValue = (value, defaultValue = '') => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (value && typeof value === 'object') {
      // Check if it's a Strapi relation with data
      if (value.data) {
        return getStringValue(value.data);
      }
      // Check if it has common string fields
      if (value.name) return getStringValue(value.name);
      if (value.title) return getStringValue(value.title);
      if (value.id) return String(value.id);
    }
    return defaultValue;
  };

  // Helper function to render rich text blocks
  const renderRichText = (blocks) => {
    if (!blocks) return 'Chưa có mô tả';
    if (typeof blocks === 'string') return blocks;
    if (Array.isArray(blocks)) {
      return blocks.map(block => {
        if (block.children && Array.isArray(block.children)) {
          return block.children.map(child => child.text || '').join('');
        }
        return '';
      }).join('\n');
    }
    return 'Chưa có mô tả';
  };

  // 2. Lấy danh sách tin đăng tương tự (lấy random 4 sản phẩm khác)
  let similarProducts = [];
  try {
    const res = await fetch(`http://localhost:1337/api/products?populate=*&pagination[limit]=8`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.data) {
      similarProducts = data.data
        .filter(p => p.documentId !== id)
        .slice(0, 4);
    }
  } catch (error) {
    console.error('Error fetching similar products:', error);
  }

  const imageUrl = product.image?.[0]?.url
    ? `http://localhost:1337${product.image[0].url}`
    : null;

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND'
  }).format(product.price || 0);

  const productName = getStringValue(product.name) || getStringValue(product.title) || 'Sản phẩm';
  const productLocation = getStringValue(product.location) || 'Toàn quốc';
  const productDescription = renderRichText(product.description);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="max-w-6xl mx-auto py-6 px-4 w-full flex-grow">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* --- CỘT TRÁI (70%) --- */}
          <div className="lg:w-2/3 space-y-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="relative h-[350px] md:h-[450px] bg-white flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={productName}
                    className="max-h-full max-w-full object-contain p-2"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                    Chưa có ảnh
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 leading-tight">
                {productName}
              </h1>
              <p className="text-2xl font-bold text-orange-600 mb-4">{formattedPrice}</p>

              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-y-2 border-t pt-4">
                <span className="mr-4 flex items-center gap-1">📍 {productLocation}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Mô tả chi tiết</h3>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed text-sm md:text-base">
                {productDescription}
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI (30%) --- */}
          <div className="lg:w-1/3 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                  {productName.charAt(0) || "C"}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{productName || "Người bán"}</h4>
                  <p className="text-xs text-gray-500">Phản hồi trong vài phút</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
                  📞 Gọi điện ngay
                </button>
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