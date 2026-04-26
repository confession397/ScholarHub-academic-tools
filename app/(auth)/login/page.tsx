'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '登录失败');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50">
      {/* Logo */}
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">欢迎回来</h1>
        <p className="text-gray-500">登录你的 ScholarHub 账户</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            邮箱地址
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused('')}
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 rounded-xl transition-all duration-200 outline-none ${
                focused === 'email'
                  ? 'border-primary-400 bg-white ring-4 ring-primary-100/50'
                  : 'border-gray-200 hover:border-gray-300 focus:border-primary-400 focus:bg-white'
              }`}
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            密码
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused('')}
              className={`w-full pl-12 pr-14 py-3.5 bg-gray-50/50 border-2 rounded-xl transition-all duration-200 outline-none ${
                focused === 'password'
                  ? 'border-primary-400 bg-white ring-4 ring-primary-100/50'
                  : 'border-gray-200 hover:border-gray-300 focus:border-primary-400 focus:bg-white'
              }`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              登录中...
            </>
          ) : (
            <>
              登录
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">或</span>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-gray-600">
          还没有账户？{' '}
          <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            立即注册
          </Link>
        </p>
      </div>

      {/* Back to Home */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <Link href="/" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors group">
          <span>&larr;</span>
          <span>返回首页</span>
        </Link>
      </div>

      {/* Footer Note */}
      <div className="mt-6 flex items-start gap-3 p-4 bg-primary-50/50 rounded-xl">
        <Sparkles className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-primary-700">ScholarHub</span> 致力于为学术研究者提供高效、安全的工具。所有数据均存储在本地。
        </div>
      </div>
    </div>
  );
}
