"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';
import { getAuthToken, canModerate, getProducts, updateProduct } from '@/lib/strapiAuth';

export default function ModerationPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !canModerate()) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      let filters = {};
      if (filter !== 'all') {
        // Optimized to match your clean database strings exactly
        const statusMap = {
          'pending': 'pending',
          'approved': 'approved',
          'rejected': 'rejected',
        };
        filters = { 'filters[productStatus][$eq]': statusMap[filter] || filter };
      }

      console.log('Fetching products with filter:', filter, 'Filters:', filters);
      const data = await getProducts(filters);
      console.log('Products fetched:', data.data?.length || 0);
      setProducts(data.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Lỗi khi tải danh sách tin');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      await updateProduct(productId, { productStatus: 'approved' });
      alert('Đã duyệt tin thành công!');
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Lỗi khi duyệt tin');
    }
  };

  const handleReject = async (productId) => {
    try {
      await updateProduct(productId, { productStatus: 'rejected' });
      alert('Đã từ chối tin thành công!');
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Lỗi khi từ chối tin');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Đã từ chối';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto mt-6 px-4 flex-grow w-full pb-10">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            📋 Kiểm duyệt tin đăng
          </h1>

          {/* Filter Navigation */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'pending' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Chờ duyệt
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'approved' ? 'bg-green-400 text-gray-800' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Đã duyệt
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'rejected' ? 'bg-red-400 text-gray-800' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Đã từ chối
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'all' ? 'bg-blue-400 text-gray-800' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Tất cả
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <>
              {/* Products List Layout */}
              {products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Không có tin nào để hiển thị
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {product.name || 'Không có tiêu đề'}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(product.productStatus)}`}>
                              {getStatusText(product.productStatus)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
                          </p>
                          <p className="text-gray-600 mb-2">
                            Danh mục: {product.categories?.name || 'Không có danh mục'}
                          </p>
                          <p className="text-gray-600 mb-2">
                            Khu vực: {product.location || 'Không có khu vực'}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {(() => {
                              const desc = product.description;
                              if (!desc) return 'Không có mô tả';
                              if (Array.isArray(desc)) {
                                return desc.map(block => {
                                  if (block.children) {
                                    return block.children.map(child => child.text || '').join('');
                                  }
                                  return '';
                                }).join('') || 'Không có mô tả';
                              }
                              return desc;
                            })()}
                          </p>
                        </div>
                        
                        {product.productStatus === 'pending' ? (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleApprove(product.documentId)}
                              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                            >
                              ✓ Duyệt
                            </button>
                            <button
                              onClick={() => handleReject(product.documentId)}
                              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                            >
                              ✗ Từ chối
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}