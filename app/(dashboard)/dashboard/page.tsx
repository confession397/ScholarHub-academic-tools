'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Brain,
  Clock,
  TreePine,
  Bookmark,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  Target,
  BarChart3,
} from 'lucide-react';

const featureCards = [
  {
    href: '/todos',
    icon: CheckSquare,
    title: '任务清单',
    description: '管理今日、本周和长期任务',
    gradient: 'from-blue-400 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100/50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    href: '/brainstorm',
    icon: Brain,
    title: '头脑风暴',
    description: '用脑图整理复杂思路',
    gradient: 'from-violet-400 to-violet-600',
    bgGradient: 'from-violet-50 to-violet-100/50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-500',
  },
  {
    href: '/time-tracker',
    icon: Clock,
    title: '时间追踪',
    description: '记录并分析时间花销',
    gradient: 'from-amber-400 to-amber-600',
    bgGradient: 'from-amber-50 to-amber-100/50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-500',
  },
  {
    href: '/focus',
    icon: TreePine,
    title: '专注森林',
    description: '番茄钟保持深度专注',
    gradient: 'from-emerald-400 to-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100/50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-500',
  },
  {
    href: '/library',
    icon: Bookmark,
    title: '收藏库',
    description: '保存和整理重要内容',
    gradient: 'from-rose-400 to-rose-600',
    bgGradient: 'from-rose-50 to-rose-100/50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-500',
  },
];

interface Stats {
  todosToday: number;
  todosWeek: number;
  focusMinutes: number;
  timeTracked: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    todosToday: 0,
    todosWeek: 0,
    focusMinutes: 0,
    timeTracked: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    Promise.all([
      fetch('/api/todos?type=today').then(res => res.json()),
      fetch('/api/todos?type=week').then(res => res.json()),
      fetch('/api/focus/stats').then(res => res.json()),
      fetch('/api/time-entries/stats').then(res => res.json()),
    ])
      .then(([today, week, focus, time]) => {
        setStats({
          todosToday: today.todos?.length || 0,
          todosWeek: week.todos?.length || 0,
          focusMinutes: focus.todayMinutes || 0,
          timeTracked: time.todayMinutes || 0,
        });
      })
      .catch(() => {});
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">欢迎回来</h1>
          <p className="text-gray-500 mt-1">这里是你的学术效率仪表盘</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>今天也要加油哦</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group bg-white rounded-2xl border border-gray-100/80 p-6 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl group-hover:animate-bounce">
              {new Date().getDate()}
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.todosToday}</p>
          <p className="text-sm text-gray-500 mt-1">今日任务</p>
        </div>

        <div className="group bg-white rounded-2xl border border-gray-100/80 p-6 hover:shadow-lg hover:border-violet-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-violet-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.todosWeek}</p>
          <p className="text-sm text-gray-500 mt-1">本周任务</p>
        </div>

        <div className="group bg-white rounded-2xl border border-gray-100/80 p-6 hover:shadow-lg hover:border-emerald-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TreePine className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatTime(stats.focusMinutes)}</p>
          <p className="text-sm text-gray-500 mt-1">专注时长</p>
        </div>

        <div className="group bg-white rounded-2xl border border-gray-100/80 p-6 hover:shadow-lg hover:border-amber-200/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatTime(stats.timeTracked)}</p>
          <p className="text-sm text-gray-500 mt-1">已追踪</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-gray-900">快捷入口</h2>
          </div>
          <Link href="/todos" className="text-sm font-medium text-primary hover:text-primary-600 transition-colors flex items-center gap-1">
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card, index) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100/80 p-6 hover:shadow-xl hover:border-gray-200/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative">
                <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>立即使用</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl p-8 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative flex items-start gap-6">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-semibold mb-2">提高效率的小建议</h3>
            <p className="text-primary-100 leading-relaxed max-w-xl">
              试试将大任务分解成25分钟的小块，用番茄工作法来完成。每完成一个番茄钟，就离目标更近一步！
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Target className="w-5 h-5 text-primary-200" />
              <span className="text-sm text-primary-100">专注 · 高效 · 有序</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
