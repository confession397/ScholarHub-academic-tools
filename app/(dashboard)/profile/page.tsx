'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  FileText,
  Camera,
  Save,
  LogOut,
  BookOpen,
  Calendar,
  AlertCircle,
  Check,
  CheckCircle,
  Shield,
  Key,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setName(data.user.name || '');
        setBio(data.user.bio || '');
        setAvatar(data.user.avatar);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, avatar: avatarPreview || avatar }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '保存成功！' });
        setAvatar(avatarPreview);
        setAvatarPreview(null);
        loadProfile();
      } else {
        setMessage({ type: 'error', text: '保存失败，请重试' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">个人资料</h1>
        <p className="text-gray-500 mt-1">管理你的账户信息和偏好设置</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 animate-fadeIn ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <Check className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
            {/* Avatar Section */}
            <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-8">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoNHY0aC0yem0wLThoLTJ2LTRoNHY0aC0yem0wLThoLTJWNmg0djJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              <div className="relative flex items-center gap-6">
                <div className="relative group">
                  {avatarPreview || avatar ? (
                    <img
                      src={avatarPreview || avatar || ''}
                      alt="Avatar"
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-xl group-hover:shadow-2xl transition-shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border-4 border-white/30 shadow-xl">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all group-hover:scale-105"
                  >
                    <Camera className="w-5 h-5 text-gray-600" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{user?.name || '设置头像'}</h2>
                  <p className="text-primary-100 mt-1">点击相机图标上传头像</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  邮箱地址不可更改，用于登录账号
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  姓名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入你的姓名"
                  className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  个人简介
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="介绍一下你自己..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-400 mt-2">
                  {bio.length}/200 字符
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    保存更改
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              账户信息
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">ScholarHub 会员</div>
                  <div className="text-xs text-gray-500">免费版</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">注册时间</div>
                  <div className="text-xs text-gray-500">
                    {user?.created_at ? formatDate(user.created_at) : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷链接</h3>
            <div className="space-y-2">
              <a href="/todos" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">任务清单</span>
              </a>
              <a href="/brainstorm" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-violet-500" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">头脑风暴</span>
              </a>
              <a href="/focus" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <TreePine className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">专注森林</span>
              </a>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-red-50 to-red-50/50 rounded-2xl border border-red-100/50 p-6">
            <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              危险区域
            </h3>
            <p className="text-sm text-red-600/80 mb-4">
              退出登录后，你需要重新输入邮箱和密码才能登录。
            </p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-50 transition-colors shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
