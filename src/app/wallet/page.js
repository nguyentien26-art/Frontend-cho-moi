"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/global_components/Header';
import Footer from '@/global_components/Footer';
import { getAuthToken, getMyProfile, createTopupRequest, getTopupRequests, getUserData } from '@/lib/strapiAuth';

export default function WalletPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState('50000'); // Mặc định 50k
  const [transactionId, setTransactionId] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Thông tin nhận tiền Vietcombank
  const BANK_CODE = 'VCB'; // Mã Vietcombank
  const ACCOUNT_NUMBER = '1039602157';
  const ACCOUNT_NAME = 'NGUYEN DUC TRUNG';

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Lấy thông tin số dư mới nhất
      const profileData = await getMyProfile();
      if (profileData) {
        setProfile(profileData);
        setBalance(profileData.balance || 0);
        
        // Lấy lịch sử nạp tiền của chính user này
        // Strapi v5 filter theo user ID
        const user = getUserData();
        const response = await getTopupRequests(user.id);
        setHistory(response.data || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu ví:', err);
      setError(err.message || 'Lỗi khi tải thông tin ví.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopupSubmit = async (e) => {
    e.preventDefault();
    if (!topupAmount || parseInt(topupAmount, 10) < 10000) {
      setError('Số tiền nạp tối thiểu là 10,000đ.');
      return;
    }
    if (!transactionId.trim()) {
      setError('Vui lòng nhập mã giao dịch Vietcombank để đối soát.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Pass the user's ID or documentId so the backend can link it
      await createTopupRequest(
        topupAmount, 
        transactionId, 
        note, 
        profile?.documentId || profile?.id // <-- Add the user's identifier here
      );
      
      setSuccess('🎉 Yêu cầu nạp tiền đã được gửi! Vui lòng chờ kiểm duyệt viên xác nhận.');
      setTransactionId('');
      setNote('');
      fetchData();
    } catch (err) {
      setError(err.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-semibold">Đang chờ duyệt</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-semibold">Đã duyệt</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-semibold">Đã từ chối</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-semibold">{status}</span>;
    }
  };

  // Tạo URL QR Code Vietcombank động từ VietQR API
  const memoContent = profile ? `CHOMOI ${profile.username}` : 'CHOMOI';
  const encodedMemo = encodeURIComponent(memoContent);
  const qrCodeUrl = `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NUMBER}-compact2.jpg?amount=${topupAmount}&addInfo=${encodedMemo}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto mt-8 px-4 flex-grow w-full pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Thẻ ví & Lịch sử nạp tiền */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Thẻ số dư ví */}
            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-400 opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute right-10 top-5 text-6xl opacity-10">💳</div>
              
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Số dư tài khoản</p>
              <h2 className="text-4xl font-extrabold mt-2 tracking-tight">
                {balance.toLocaleString('vi-VN')} <span className="text-2xl font-medium">VND</span>
              </h2>
              
              <div className="mt-8 pt-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-400">
                <div>
                  <p>Chủ ví: <span className="text-white font-medium">{profile?.username || profile?.email}</span></p>
                </div>
                <div>
                  <p>Trạng thái: <span className="text-green-400 font-medium">Hoạt động</span></p>
                </div>
              </div>
            </div>

            {/* Lịch sử giao dịch */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                ⏳ Lịch sử nạp tiền
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                </div>
              ) : history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Bạn chưa thực hiện yêu cầu nạp tiền nào.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 text-sm">
                        <th className="pb-3 font-semibold">Thời gian</th>
                        <th className="pb-3 font-semibold">Số tiền</th>
                        <th className="pb-3 font-semibold">Mã giao dịch</th>
                        <th className="pb-3 font-semibold">Ghi chú</th>
                        <th className="pb-3 font-semibold">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {history.map((req) => (
                        <tr key={req.id}>
                          <td className="py-3 text-gray-600">
                            {new Date(req.attributes?.createdAt || req.createdAt).toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3 font-bold text-gray-800">
                            {((req.attributes?.amount || req.amount) || 0).toLocaleString('vi-VN')}đ
                          </td>
                          <td className="py-3 font-mono text-indigo-600 font-semibold">
                            {req.attributes?.transactionId || req.transactionId}
                          </td>
                          <td className="py-3 text-gray-500 max-w-xs truncate">
                            {req.attributes?.note || req.note || '-'}
                          </td>
                          <td className="py-3">
                            {getStatusBadge(req.attributes?.requestStatus || req.requestStatus)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Cột phải: Hướng dẫn nạp tiền Vietcombank & Form xác nhận */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              ⚡ Nạp tiền nhanh qua Vietcombank
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                {success}
              </div>
            )}

            {/* Form chọn số tiền */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nhập số tiền muốn nạp (đ)</label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                placeholder="Ví dụ: 50000"
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 font-bold text-lg text-gray-800"
              />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {['20000', '50000', '100000', '200000'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTopupAmount(val)}
                    className={`text-xs py-1.5 border rounded-md font-semibold transition ${
                      topupAmount === val ? 'bg-yellow-400 border-yellow-400 text-gray-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {parseInt(val) / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code động */}
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 text-center flex flex-col items-center mb-6">
              <p className="text-xs text-yellow-800 font-semibold mb-2">Quét mã Vietcombank để chuyển khoản</p>
              
              {/* Box chứa QR Code */}
              <div className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-100 mb-3">
                <img
                  src={qrCodeUrl}
                  alt="Vietcombank QR Code"
                  className="w-48 h-48 object-contain transition-all duration-300"
                />
              </div>

              <div className="text-left w-full text-xs space-y-1 text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                <p>Số tài khoản: <span className="font-bold text-black">{ACCOUNT_NUMBER}</span></p>
                <p>Người nhận: <span className="font-bold text-black">{ACCOUNT_NAME}</span></p>
                <p>Ngân hàng: <span className="font-bold text-black">Vietcombank</span></p>
                <p>Số tiền: <span className="font-bold text-red-500">{(parseInt(topupAmount, 10) || 0).toLocaleString('vi-VN')} đ</span></p>
                <p>Nội dung CK: <span className="font-mono font-bold bg-yellow-100 px-1.5 py-0.5 rounded text-black select-all">{memoContent}</span></p>
              </div>
            </div>

            {/* Form xác nhận giao dịch */}
            <form onSubmit={handleTopupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã giao dịch Vietcombank <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Nhập mã giao dịch gồm 10-12 chữ số"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm font-semibold placeholder:font-normal"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ghi chú (Không bắt buộc)</label>
                <textarea
                  rows="2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Thông tin bổ sung..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-yellow-400 text-gray-800 font-bold py-3 rounded-md hover:bg-yellow-500 transition shadow-sm active:transform active:scale-[0.99] disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                    Đang gửi yêu cầu...
                  </>
                ) : '✔️ Xác nhận đã chuyển khoản'}
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}