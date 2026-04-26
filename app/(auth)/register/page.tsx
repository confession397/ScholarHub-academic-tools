'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Sparkles, Shield } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const passwordRequirements = [
    { met: password.length >= 6, text: '至少6个字符' },
    { met: password === confirmPassword && password.length > 0, text: '两次密码一致' },
  ];

  const allRequirementsMet = passwordRequirements.every(r => r.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为6个字符');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '注册失败');
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
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">创建账户</h1>
        <p className="text-gray-500">开始你的学术效率之旅</p>
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
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            姓名（可选）
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="w-5 h-5" />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused('')}
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 rounded-xl transition-all duration-200 outline-none ${
                focused === 'name'
                  ? 'border-primary-400 bg-white ring-4 ring-primary-100/50'
                  : 'border-gray-200 hover:border-gray-300 focus:border-primary-400 focus:bg-white'
              }`}
              placeholder="你的姓名"
            />
          </div>
        </div>

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
              placeholder="至少6个字符"
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

          {/* Password Strength */}
          {password.length > 0 && (
            <div className="mt-3 space-y-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className={`w-4 h-4 ${req.met ? 'text-emerald-500' : 'text-gray-300'}`} />
                  <span className={req.met ? 'text-emerald-600' : 'text-gray-400'}>{req.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            确认密码
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocused('confirm')}
              onBlur={() => setFocused('')}
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 rounded-xl transition-all duration-200 outline-none ${
                focused === 'confirm'
                  ? 'border-primary-400 bg-white ring-4 ring-primary-100/50'
                  : 'border-gray-200 hover:border-gray-300 focus:border-primary-400 focus:bg-white'
              }`}
              placeholder="再次输入密码"
              required
            />
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-3 p-4 bg-secondary-50/50 rounded-xl border border-secondary-100/50">
          <Shield className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            注册即表示你同意我们的服务条款。我们重视你的隐私，所有数据都将安全存储。
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !allRequirementsMet}
          className="w-full py-3.5 mt-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              创建中...
            </>
          ) : (
            <>
              创建账户
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          已有账户？{' '}
          <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            立即登录
          </Link>
        </p>
      </div>

      {/* Back to Home */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <Link href="/" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors group">
          <span>&larr;</span>
          <span>返回首页</span>
        </Link>
      </div>
    </div>
  );
}
