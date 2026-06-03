"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';
import { getAuthToken, canPost, createProduct, getUserData, getMyProfile } from '@/lib/strapiAuth';

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userBalance, setUserBalance] = useState(null);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    location: '',
    description: '',
    seller: '',
    type: '',
  });

  // Danh mục từ frontend (khám phá danh mục)
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

  // Mapping từ tên danh mục sang slug cho routing (đồng bộ với [category]/page.js)
  const categorySlugMap = {
    'Bất động sản': 'bat-dong-san',
    'Xe cộ': 'xe-co',
    'Đồ điện tử': 'do-dien-tu',
    'Thú cưng': 'thu-cung',
    'Thời trang, đồ dùng cá nhân': 'thoi-trang, do-dung-ca-nhan',
    'Đồ gia dụng, nội thất, cây cảnh': 'do-gia-dung, noi that, cay canh',
    'Đồ dùng cho văn phòng': 'do-dung-cho-van-phong',
    'Giải trí, thể thao, sở thích': 'giai-tri, the-thao, so-thich',
    'Đồ ăn, thực phẩm, và các loại khác': 'do-an, thuc-pham, va-cac-loai-khac',
  };
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !canPost()) {
      router.push('/auth/login');
      return;
    }

    // Tự động lấy tên người bán từ user đăng nhập
    const userData = getUserData();
    if (userData) {
      setFormData(prev => ({
        ...prev,
        seller: userData.username || userData.email,
      }));
    }

    // Kiểm tra số dư người dùng
    getMyProfile().then(profile => {
      if (profile) {
        setUserBalance(profile.balance);
        const userRole = profile.role?.type || profile.role?.name;
        const isModeratorOrAdmin = userRole === 'moderator' || userRole === 'admin';
        
        if (!isModeratorOrAdmin && (profile.balance || 0) < 5000) {
          setInsufficientBalance(true);
          setError('Số dư tài khoản của bạn không đủ để đăng tin (Cần tối thiểu 5,000đ). Vui lòng nạp thêm tiền.');
        }
      }
    }).catch(err => {
      console.error('Lỗi khi kiểm tra số dư:', err);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createProduct({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        location: formData.location,
        description: formData.description,
        seller: formData.seller,
        type: formData.type,
        images: selectedImages,
      });

      alert("🎉 Tin của bạn đã được đăng thành công và đang chờ duyệt!");
      router.push('/');
    } catch (err) {
      setError(err.message || 'Đăng tin thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      alert('Chỉ được tải tối đa 6 ảnh');
      return;
    }
    setSelectedImages(files);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="max-w-3xl mx-auto mt-6 px-4 flex-grow w-full pb-10">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            📝 Đăng tin mới
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Khu vực tải ảnh */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageSelect}
                className="hidden"
                id="imageInput"
              />
              <div
                onClick={() => document.getElementById('imageInput').click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-yellow-50 hover:border-yellow-400 transition cursor-pointer"
              >
                <span className="text-5xl mb-3 block">📸</span>
                <p className="text-gray-600 font-medium">Bấm vào đây để tải ảnh lên</p>
                <p className="text-gray-400 text-sm mt-1">Hỗ trợ định dạng JPG, PNG (Tối đa 6 ảnh)</p>
              </div>

              {/* Preview ảnh */}
              {selectedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tên sản phẩm */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ví dụ: Xe Honda Wave Alpha 2021 chính chủ"
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>

            {/* Danh mục & Giá */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 bg-white cursor-pointer transition text-gray-900 font-medium"
                >
                  <option value="" className="text-gray-500">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: 15000000"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Khu vực */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Khu vực <span className="text-red-500">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white cursor-pointer transition text-gray-900 font-medium"
              >
                <option value="" className="text-gray-500">-- Chọn tỉnh/thành phố --</option>
                <option value="ha-noi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="da-nang">Đà Nẵng</option>
                <option value="can-tho">Cần Thơ</option>
              </select>
            </div>

            {/* Mô tả chi tiết */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Mô tả tình trạng, xuất xứ, thời gian sử dụng, phụ kiện đi kèm..."
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition resize-y text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
              ></textarea>
            </div>

            {/* Loại sản phẩm */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Loại sản phẩm
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Ví dụ: Xe máy, Điện thoại, Laptop..."
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>

            {/* Nút Submit */}
            <div className="pt-2">
              {insufficientBalance ? (
                <button
                  type="button"
                  onClick={() => router.push('/wallet')}
                  className="w-full bg-red-500 text-white font-bold text-lg py-4 rounded-md hover:bg-red-600 transition shadow-md active:transform active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  💳 Nạp tiền ngay để đăng tin (Phí: 5,000đ)
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-gray-800 font-bold text-lg py-4 rounded-md hover:bg-yellow-500 transition shadow-md active:transform active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? 'Đang đăng...' : '🚀 Đăng tin ngay (Phí: 5,000đ)'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}