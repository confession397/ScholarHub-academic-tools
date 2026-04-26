'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  CheckSquare,
  Brain,
  Clock,
  TreePine,
  Bookmark,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: '仪表盘', color: 'text-blue-500', bgHover: 'hover:bg-blue-50' },
  { href: '/todos', icon: CheckSquare, label: '任务清单', color: 'text-violet-500', bgHover: 'hover:bg-violet-50' },
  { href: '/brainstorm', icon: Brain, label: '头脑风暴', color: 'text-purple-500', bgHover: 'hover:bg-purple-50' },
  { href: '/time-tracker', icon: Clock, label: '时间追踪', color: 'text-amber-500', bgHover: 'hover:bg-amber-50' },
  { href: '/focus', icon: TreePine, label: '专注森林', color: 'text-emerald-500', bgHover: 'hover:bg-emerald-50' },
  { href: '/library', icon: Bookmark, label: '收藏库', color: 'text-rose-500', bgHover: 'hover:bg-rose-50' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/login');
        } else {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div className="text-primary font-medium animate-pulse">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-100/80 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100/80 justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-serif font-bold text-gray-900">
                ScholarHub
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? `bg-gradient-to-r from-primary-50 to-primary-50/50 ${item.color}`
                    : `text-gray-600 ${item.bgHover}`
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                {!sidebarCollapsed && (
                  <span className={`font-medium ${isActive ? '' : 'group-hover:translate-x-0.5 transition-transform'}`}>
                    {item.label}
                  </span>
                )}
                {isActive && !sidebarCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100/80">
          <Link
            href="/profile"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-gray-50 ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || '用户'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className={`mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100/80">
        <div className="h-16 flex items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-serif font-bold text-gray-900">ScholarHub</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="bg-white border-t border-gray-100 py-4 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? `bg-gradient-to-r from-primary-50 to-primary-50/50 ${item.color}`
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">个人资料</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">退出登录</span>
            </button>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 min-h-screen">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
