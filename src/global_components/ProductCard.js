import Link from 'next/link';
import { useCart } from "@/context/CartContext";


export default function ProductCard({ product }) {
  // Xử lý đường dẫn ảnh từ Strapi, nếu không có ảnh thì hiển thị ảnh mặc định
  const imageUrl = product.image?.[0]?.url 
    ? `http://localhost:1337${product.image[0].url}` 
    : 'https://via.placeholder.com/400x300?text=Chua+co+anh';

  // Format giá tiền sang chuẩn VNĐ
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price);
  const { addToCart } = useCart();

  return (
    // Dùng documentId làm đường dẫn chi tiết
    <Link href={`/product/${product.documentId}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col">
        {/* Khu vực ảnh */}
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Khu vực thông tin */}
        <div className="p-3 md:p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-gray-800 text-sm md:text-base line-clamp-2 mb-2">
            {product.name}
          </h3>
          <p className="font-bold text-orange-500 text-base md:text-lg mt-auto">
            {formattedPrice}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-50">
            <span>📍 {product.location || 'Toàn quốc'}</span>
          </div>
        </div>
      </div> 

      <button onClick={() => addToCart(product)} className="bg-blue-500 text-white p-2">
      Thêm vào giỏ
      </button>
    </Link>
  );
}