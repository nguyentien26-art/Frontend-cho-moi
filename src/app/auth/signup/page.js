"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/strapiAuth';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (!agreed) {
      setError('Vui lòng chấp nhận điều khoản và chính sách');
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        username: fullName,
        email: email,
        password: password,
      });

      // Redirect to login with success message
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Logo */}
          <h1 className="text-3xl font-bold text-center text-black mb-8">
            🛒 choMỌI
          </h1>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Đăng ký
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
              />
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded mt-1"
              />
              <span className="text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <a href="#" className="text-yellow-500 hover:text-yellow-600">
                  Điều khoản dịch vụ
                </a>
                {' '}và{' '}
                <a href="#" className="text-yellow-500 hover:text-yellow-600">
                  Chính sách bảo mật
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-gray-800 font-semibold py-2 rounded-md hover:bg-yellow-500 transition disabled:opacity-50"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="space-y-2 mb-6">
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium">
              Đăng ký với Facebook
            </button>
            <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition font-medium">
              Đăng ký với Google
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/auth/login" className="text-yellow-500 hover:text-yellow-600 font-semibold">
              Đăng nhập
            </Link>
          </p>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
