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
  Sun,
  Moon,
} from 'lucide-react';

const featureCards = [
  {
    href: '/todos',
    icon: CheckSquare,
    emoji: '📋',
    title: '任务清单',
    description: '智能分类，优先级一目了然',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50/80 to-blue-100/50',
    iconBg: 'bg-gradient-to-br from-blue-100 to-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    href: '/brainstorm',
    icon: Brain,
    emoji: '💡',
    title: '头脑风暴',
    description: '无限层级，思维导图式整理',
    gradient: 'from-violet-500 to-violet-600',
    bgGradient: 'from-violet-50/80 to-violet-100/50',
    iconBg: 'bg-gradient-to-br from-violet-100 to-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    href: '/time-tracker',
    icon: Clock,
    emoji: '⏱️',
    title: '时间追踪',
    description: '记录每一分钟的时间分配',
    gradient: 'from-amber-500 to-amber-600',
    bgGradient: 'from-amber-50/80 to-amber-100/50',
    iconBg: 'bg-gradient-to-br from-amber-100 to-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    href: '/focus',
    icon: TreePine,
    emoji: '🌲',
    title: '专注森林',
    description: '番茄工作法，种植专注之树',
    gradient: 'from-emerald-500 to-emerald-600',
    bgGradient: 'from-emerald-50/80 to-emerald-100/50',
    iconBg: 'bg-gradient-to-br from-emerald-100 to-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    href: '/library',
    icon: Bookmark,
    emoji: '📚',
    title: '知识收藏',
    description: '干净保存，一键收藏网页',
    gradient: 'from-rose-500 to-rose-600',
    bgGradient: 'from-rose-50/80 to-rose-100/50',
    iconBg: 'bg-gradient-to-br from-rose-100 to-rose-50',
    iconColor: 'text-rose-600',
  },
];

const quickStats = [
  { label: '今日任务', icon: Calendar, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
  { label: '本周任务', icon: TrendingUp, color: 'from-violet-500 to-violet-600', bgColor: 'bg-violet-50' },
  { label: '专注时长', icon: TreePine, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50' },
  { label: '已追踪', icon: Clock, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50' },
];

interface Stats {
  todosToday: number;
  todosWeek: number;
  focusMinutes: number;
  timeTracked: number;
}

const tips = [
  { emoji: '🎯', text: '试试将大任务分解成25分钟的小块' },
  { emoji: '📝', text: '每天早上制定今日计划，效率提升50%' },
  { emoji: '🌟', text: '完成重要任务后，给自己一个小奖励' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    todosToday: 0,
    todosWeek: 0,
    focusMinutes: 0,
    timeTracked: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [currentTip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: '早上好', icon: Sun, emoji: '☀️' };
    if (hour < 18) return { text: '下午好', icon: Moon, emoji: '🌤️' };
    return { text: '晚上好', icon: Moon, emoji: '🌙' };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

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
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const statsValues = [stats.todosToday, stats.todosWeek, formatTime(stats.focusMinutes), formatTime(stats.timeTracked)];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center shadow-md">
            <GreetingIcon className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-2">
              <span>{greeting.text}</span>
              <span className="text-2xl">{greeting.emoji}</span>
            </h1>
            <p className="text-gray-500 mt-0.5">这里是你的学术效率仪表盘</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-50 to-violet-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-100/50 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>今天也要加油哦 ✨</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className={`group relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${mounted ? 'animate-fadeInUp' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 顶部装饰线 */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              {/* 左侧图标区 */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <StatIcon className={`w-6 h-6 ${stat.color.split(' ')[0].replace('from-', 'text-')}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {statsValues[index]}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              </div>

              {/* 悬停时的浮动装饰 */}
              <div className={`absolute -bottom-2 -right-2 w-16 h-16 ${stat.bgColor} rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl`} />
            </div>
          );
        })}
      </div>

      {/* Feature Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-serif font-semibold text-gray-900">快捷入口</h2>
            <span className="w-8 h-0.5 bg-gradient-to-r from-primary-400 to-transparent rounded-full" />
          </div>
          <Link href="/todos" className="text-sm font-medium text-primary hover:text-primary-600 transition-colors flex items-center gap-1 group">
            <span>查看全部</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`group relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${mounted ? 'animate-fadeInUp' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 渐变背景 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* 顶部装饰 */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500 -translate-y-12 translate-x-12`} />

                <div className="relative">
                  {/* Emoji + Icon 组合 */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{card.emoji}</span>
                    <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                    {card.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {card.description}
                  </p>

                  {/* 底部渐变线 */}
                  <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tips Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-violet-700 rounded-3xl p-8 text-white">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/20 rounded-full blur-xl" />
        </div>

        {/* 装饰性圆点 */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full" />
        <div className="absolute top-12 left-1/4 w-1.5 h-1.5 bg-white/20 rounded-full" />
        <div className="absolute bottom-8 right-1/4 w-2 h-2 bg-white/20 rounded-full" />

        <div className="relative flex items-start gap-6">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl border border-white/20">
            <span className="text-3xl">{currentTip.emoji}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary-200" />
              <span className="text-sm font-semibold text-primary-200">今日小贴士</span>
            </div>
            <h3 className="text-xl font-serif font-semibold mb-2">{currentTip.text}</h3>
            <div className="flex items-center gap-3 text-sm text-primary-100/80">
              <Target className="w-4 h-4" />
              <span>专注 · 高效 · 有序</span>
              <span className="w-1 h-1 bg-primary-200/50 rounded-full" />
              <span>继续加油 💪</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
