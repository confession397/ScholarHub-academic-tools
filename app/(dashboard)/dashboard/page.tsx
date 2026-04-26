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
} from 'lucide-react';

const featureCards = [
  {
    href: '/todos',
    icon: CheckSquare,
    title: '任务清单',
    description: '管理你的今日、每周和长期任务',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    href: '/brainstorm',
    icon: Brain,
    title: '头脑风暴',
    description: '用脑图和结构化笔记整理思路',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    href: '/time-tracker',
    icon: Clock,
    title: '时间追踪',
    description: '记录并复盘你的时间花销',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    href: '/focus',
    icon: TreePine,
    title: '专注森林',
    description: '番茄钟帮你保持专注',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
  },
  {
    href: '/library',
    icon: Bookmark,
    title: '收藏库',
    description: '保存和整理重要网页内容',
    color: 'bg-rose-500',
    bgColor: 'bg-rose-50',
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
    // 加载统计数据
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
          focusMinutes: focus.totalMinutes || 0,
          timeTracked: time.totalMinutes || 0,
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
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">欢迎回来</h1>
        <p className="text-gray-600 mt-1">这里是你的学术效率仪表盘</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.todosToday}</p>
          <p className="text-sm text-gray-500">今日任务</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.todosWeek}</p>
          <p className="text-sm text-gray-500">本周任务</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <TreePine className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatTime(stats.focusMinutes)}</p>
          <p className="text-sm text-gray-500">专注时长</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatTime(stats.timeTracked)}</p>
          <p className="text-sm text-gray-500">已追踪</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-serif font-semibold text-gray-900">快捷入口</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">提高效率的小建议</h3>
            <p className="text-gray-600 leading-relaxed">
              试试将大任务分解成25分钟的小块，用番茄工作法来完成。每完成一个番茄钟，就离目标更近一步！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
