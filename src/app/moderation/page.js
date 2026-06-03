"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';
import { 
  getAuthToken, 
  canModerate, 
  getProducts, 
  updateProduct,
  getTopupRequests,
  updateTopupRequestStatus,
  getAllUsers,
  adjustUserBalance
} from '@/lib/strapiAuth';

export default function ModerationPage() {
  const router = useRouter();
  
  // Tab Management: products (Kiểm duyệt tin), topups (Duyệt nạp tiền), users (Quản lý số dư)
  const [activeTab, setActiveTab] = useState('products');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tab 1: Products state
  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState('pending'); // pending, approved, rejected, all

  // Tab 2: Topup requests state
  const [topups, setTopups] = useState([]);
  const [topupFilter, setTopupFilter] = useState('pending'); // pending, approved, rejected, all

  // Tab 3: Users state
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('50000');
  const [adjustType, setAdjustType] = useState('plus'); // plus (Cộng), minus (Trừ)
  const [adjustLoading, setAdjustLoading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !canModerate()) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    fetchTabContent();
  }, [activeTab, productFilter, topupFilter]);

  const fetchTabContent = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (activeTab === 'products') {
        let filters = {};
        if (productFilter !== 'all') {
          const statusMap = {
            'pending': '     pending (chờ duyệt)',
            'approved': '     approved (đã duyệt)',
            'rejected': '     rejected (đã từ chối)',
          };
          filters = { 'filters[productStatus][$eq]': statusMap[productFilter] || productFilter };
        }
        const data = await getProducts(filters);
        setProducts(data.data || []);
      } else if (activeTab === 'topups') {
        let filters = { 'sort[0]': 'createdAt:desc' };
        if (topupFilter !== 'all') {
          filters['filters[requestStatus][$eq]'] = topupFilter;
        }
        const data = await getTopupRequests(filters);
        setTopups(data.data || []);
      } else if (activeTab === 'users') {
        const data = await getAllUsers();
        setUsersList(data || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu kiểm duyệt:', err);
      setError(err.message || 'Lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  // Product actions
  const handleApproveProduct = async (productId) => {
    try {
      await updateProduct(productId, { productStatus: '     approved (đã duyệt)' });
      setSuccess('Đã duyệt tin đăng thành công!');
      fetchTabContent();
    } catch (err) {
      setError(err.message || 'Lỗi khi duyệt tin.');
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      await updateProduct(productId, { productStatus: '     rejected (đã từ chối)' });
      setSuccess('Đã từ chối tin đăng thành công!');
      fetchTabContent();
    } catch (err) {
      setError(err.message || 'Lỗi khi từ chối tin.');
    }
  };

  // Topup actions
  const handleApproveTopup = async (topupId) => {
    if (!confirm('Bạn có chắc chắn muốn DUYỆT yêu cầu nạp tiền này? Số tiền sẽ lập tức được cộng vào số dư của user.')) {
      return;
    }
    try {
      await updateTopupRequestStatus(topupId, 'approved');
      setSuccess('Đã duyệt yêu cầu nạp tiền thành công và cộng số dư!');
      fetchTabContent();
    } catch (err) {
      setError(err.message || 'Lỗi khi duyệt nạp tiền.');
    }
  };

  const handleRejectTopup = async (topupId) => {
    if (!confirm('Bạn có chắc chắn muốn TỪ CHỐI yêu cầu nạp tiền này?')) {
      return;
    }
    try {
      await updateTopupRequestStatus(topupId, 'rejected');
      setSuccess('Đã từ chối yêu cầu nạp tiền.');
      fetchTabContent();
    } catch (err) {
      setError(err.message || 'Lỗi khi từ chối nạp tiền.');
    }
  };

  // Adjust balance actions
  const handleOpenAdjustModal = (user) => {
    setSelectedUser(user);
    setAdjustAmount('50000');
    setAdjustType('plus');
    setShowAdjustModal(true);
  };

  const handleAdjustBalanceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    const amountVal = parseInt(adjustAmount, 10);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ.');
      return;
    }

    const finalAmount = adjustType === 'plus' ? amountVal : -amountVal;
    
    setAdjustLoading(true);
    try {
      await adjustUserBalance(selectedUser.documentId, finalAmount);
      setSuccess(`Đã điều chỉnh số dư thành công cho user: ${selectedUser.username}`);
      setShowAdjustModal(false);
      setSelectedUser(null);
      fetchTabContent();
    } catch (err) {
      alert(err.message || 'Điều chỉnh số dư thất bại.');
    } finally {
      setAdjustLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case '     pending (chờ duyệt)':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
      case '     approved (đã duyệt)':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
      case '     rejected (đã từ chối)':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    const s = status?.trim();
    if (s === 'pending (chờ duyệt)' || s === 'pending') return 'Chờ duyệt';
    if (s === 'approved (đã duyệt)' || s === 'approved') return 'Đã duyệt';
    if (s === 'rejected (đã từ chối)' || s === 'rejected') return 'Đã từ chối';
    return status;
  };

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = usersList.filter(u => 
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto mt-6 px-4 flex-grow w-full pb-16">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
            🛡️ Bảng điều khiển Kiểm duyệt viên
          </h1>

          {/* Alert Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              ⚠️ {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
              ✅ {success}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6 flex gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-5 py-3 font-bold border-b-2 text-sm transition-all ${
                activeTab === 'products' ? 'border-yellow-400 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📦 Kiểm duyệt tin đăng ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('topups')}
              className={`px-5 py-3 font-bold border-b-2 text-sm transition-all ${
                activeTab === 'topups' ? 'border-yellow-400 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🪙 Yêu cầu nạp tiền ({topups.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-3 font-bold border-b-2 text-sm transition-all ${
                activeTab === 'users' ? 'border-yellow-400 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              👥 Quản lý số dư ({usersList.length})
            </button>
          </div>

          {/* Loading indicator */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              <p className="mt-2 text-gray-500 text-sm">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {/* Tab 1: Product Moderation */}
              {activeTab === 'products' && (
                <div>
                  <div className="mb-6 flex gap-2">
                    {['pending', 'approved', 'rejected', 'all'].map(status => (
                      <button
                        key={status}
                        onClick={() => setProductFilter(status)}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold border transition ${
                          productFilter === status 
                            ? 'bg-yellow-400 border-yellow-400 text-gray-800' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {status === 'all' ? 'Tất cả' : getStatusText(status)}
                      </button>
                    ))}
                  </div>

                  {products.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Không có tin đăng nào cần xử lý.</p>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white flex flex-col md:flex-row gap-5 justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-lg font-bold text-gray-800">
                                {product.attributes?.name || product.name || 'Không có tên'}
                              </h3>
                              <span className={`px-2 py-0.5 border rounded text-xs font-semibold ${getStatusColor(product.attributes?.productStatus || product.productStatus)}`}>
                                {getStatusText(product.attributes?.productStatus || product.productStatus)}
                              </span>
                            </div>
                            
                            <p className="text-sm font-bold text-red-500 mb-2">
                              Giá: {((product.attributes?.price || product.price) || 0).toLocaleString('vi-VN')} đ
                            </p>

                            <div className="text-xs text-gray-500 space-y-1 mb-3">
                              <p>Người bán: <span className="font-semibold text-gray-700">{product.attributes?.seller || product.seller}</span></p>
                              <p>Khu vực: <span className="font-semibold text-gray-700">{product.attributes?.location || product.location}</span></p>
                              <p>Phân loại: <span className="font-semibold text-gray-700">{product.attributes?.type || product.type || 'Chưa phân loại'}</span></p>
                            </div>

                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-line">
                              {(() => {
                                const desc = product.attributes?.description || product.description;
                                if (!desc) return 'Không có mô tả';
                                if (Array.isArray(desc)) {
                                  return desc.map(block => block.children?.map(child => child.text || '').join('') || '').join('\n');
                                }
                                return desc;
                              })()}
                            </p>
                          </div>

                          <div className="flex md:flex-col justify-end items-end gap-2 shrink-0">
                            {((product.attributes?.productStatus || product.productStatus)?.includes('pending')) && (
                              <>
                                <button
                                  onClick={() => handleApproveProduct(product.documentId)}
                                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-bold shadow-sm transition active:scale-95 flex-1 md:w-32"
                                >
                                  ✓ Duyệt đăng
                                </button>
                                <button
                                  onClick={() => handleRejectProduct(product.documentId)}
                                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-bold shadow-sm transition active:scale-95 flex-1 md:w-32"
                                >
                                  ✗ Từ chối
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Topup requests approval */}
              {activeTab === 'topups' && (
                <div>
                  <div className="mb-6 flex gap-2">
                    {['pending', 'approved', 'rejected', 'all'].map(status => (
                      <button
                        key={status}
                        onClick={() => setTopupFilter(status)}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold border transition ${
                          topupFilter === status 
                            ? 'bg-yellow-400 border-yellow-400 text-gray-800' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {status === 'all' ? 'Tất cả' : getStatusText(status)}
                      </button>
                    ))}
                  </div>

                  {topups.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Không có yêu cầu nạp tiền nào.</p>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase">
                            <th className="p-4">Khách hàng</th>
                            <th className="p-4">Số tiền</th>
                            <th className="p-4">Mã giao dịch MoMo</th>
                            <th className="p-4">Ghi chú từ khách</th>
                            <th className="p-4">Thời gian tạo</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4 text-center">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {topups.map((req) => {
                            const userObj = req.attributes?.users_permissions_user?.data || req.users_permissions_user;
                            const username = userObj?.attributes?.username || userObj?.username || 'Khách vãng lai';
                            const email = userObj?.attributes?.email || userObj?.email || '';
                            const reqStatus = req.attributes?.requestStatus || req.requestStatus;
                            const amountVal = req.attributes?.amount || req.amount || 0;

                            return (
                              <tr key={req.id} className="hover:bg-gray-50/50">
                                <td className="p-4">
                                  <div>
                                    <p className="font-bold text-gray-800">{username}</p>
                                    <p className="text-xs text-gray-400">{email}</p>
                                  </div>
                                </td>
                                <td className="p-4 font-bold text-green-600">
                                  +{amountVal.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="p-4 font-mono font-bold text-indigo-600">
                                  {req.attributes?.transactionId || req.transactionId}
                                </td>
                                <td className="p-4 text-gray-500 max-w-xs truncate">
                                  {req.attributes?.note || req.note || '-'}
                                </td>
                                <td className="p-4 text-gray-400 text-xs">
                                  {new Date(req.attributes?.createdAt || req.createdAt).toLocaleString('vi-VN')}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 border rounded text-xs font-semibold ${getStatusColor(reqStatus)}`}>
                                    {getStatusText(reqStatus)}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  {reqStatus === 'pending' ? (
                                    <div className="flex gap-1.5 justify-center">
                                      <button
                                        onClick={() => handleApproveTopup(req.documentId)}
                                        className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-bold transition active:scale-95"
                                      >
                                        ✓ Duyệt
                                      </button>
                                      <button
                                        onClick={() => handleRejectTopup(req.documentId)}
                                        className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold transition active:scale-95"
                                      >
                                        ✗ Từ chối
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 text-xs font-medium">Đã xử lý</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: User balance management */}
              {activeTab === 'users' && (
                <div>
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="🔍 Tìm kiếm thành viên (Username hoặc email)..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm font-medium"
                    />
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase">
                          <th className="p-4">Tên tài khoản</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Vai trò (Role)</th>
                          <th className="p-4">Số dư hiện tại</th>
                          <th className="p-4 text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-400">Không tìm thấy thành viên phù hợp</td>
                          </tr>
                        ) : (
                          filteredUsers.map((userObj) => {
                            const isUserModOrAdmin = userObj.role?.type === 'moderator' || userObj.role?.type === 'admin';
                            
                            return (
                              <tr key={userObj.id} className="hover:bg-gray-50/50">
                                <td className="p-4 font-bold text-gray-800">{userObj.username}</td>
                                <td className="p-4 text-gray-600">{userObj.email}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                    isUserModOrAdmin ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {userObj.role?.name || userObj.role?.type}
                                  </span>
                                </td>
                                <td className="p-4 font-bold text-gray-900">
                                  {(userObj.balance || 0).toLocaleString('vi-VN')} đ
                                </td>
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => handleOpenAdjustModal(userObj)}
                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold transition shadow-sm active:scale-95"
                                  >
                                    🪙 Cộng/Trừ tiền
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Adjust balance modal */}
      {showAdjustModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowAdjustModal(false);
                setSelectedUser(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
            
            <h3 className="text-lg font-bold text-gray-800 mb-2">🪙 Điều chỉnh số dư</h3>
            <p className="text-sm text-gray-500 mb-6">
              Cộng hoặc trừ số dư cho thành viên: <span className="font-semibold text-black">{selectedUser.username}</span> ({selectedUser.email})
            </p>

            <form onSubmit={handleAdjustBalanceSubmit} className="space-y-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAdjustType('plus')}
                  className={`flex-1 py-2 border rounded-md font-bold text-sm transition ${
                    adjustType === 'plus' ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  🟢 Cộng tiền (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('minus')}
                  className={`flex-1 py-2 border rounded-md font-bold text-sm transition ${
                    adjustType === 'minus' ? 'bg-red-500 border-red-500 text-white' : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  🔴 Trừ tiền (-)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Số tiền (đ)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-md text-sm transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-md text-sm transition flex items-center justify-center gap-1.5"
                >
                  {adjustLoading ? 'Đang thực hiện...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
