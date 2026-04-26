'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  CheckSquare,
  Brain,
  Clock,
  TreePine,
  Bookmark,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Play,
  Star,
  Users,
  Heart,
  Rocket,
  Lock,
  Code,
  Monitor,
  Palette,
  Layers,
  GitBranch,
  Timer,
  Library,
} from 'lucide-react';

const features = [
  {
    emoji: '📋',
    icon: CheckSquare,
    title: '任务清单',
    description: '智能分类，优先级一目了然',
    color: 'from-blue-400 to-blue-600',
    href: '/todos',
  },
  {
    emoji: '💡',
    icon: Brain,
    title: '头脑风暴',
    description: '无限层级，思维导图式整理',
    color: 'from-violet-400 to-violet-600',
    href: '/brainstorm',
  },
  {
    emoji: '⏱️',
    icon: Clock,
    title: '时间追踪',
    description: '记录每一分钟的时间分配',
    color: 'from-amber-400 to-amber-600',
    href: '/time-tracker',
  },
  {
    emoji: '🌲',
    icon: TreePine,
    title: '专注森林',
    description: '番茄工作法，种植专注之树',
    color: 'from-emerald-400 to-emerald-600',
    href: '/focus',
  },
  {
    emoji: '📚',
    icon: Bookmark,
    title: '知识收藏',
    description: '干净保存，一键收藏网页',
    color: 'from-rose-400 to-rose-600',
    href: '/library',
  },
];

const highlights = [
  { emoji: '🎨', title: '优雅界面', desc: '学术期刊风格设计' },
  { emoji: '⚡', title: '极速响应', desc: '流畅操作体验' },
  { emoji: '🔒', title: '隐私优先', desc: '本地数据存储' },
  { emoji: '💝', title: '完全免费', desc: '开源MIT协议' },
];

const testimonials = [
  {
    name: '李明',
    role: '计算机科学博士',
    content: '界面太优雅了！用它整理论文思路效率提升超多 💯',
    avatar: '👨‍🎓',
    rating: 5,
  },
  {
    name: '王芳',
    role: '研二学生',
    content: '专注森林太治愈了，学习动力满满 🌳',
    avatar: '👩‍🔬',
    rating: 5,
  },
  {
    name: '张伟',
    role: '独立研究员',
    content: '终于有一个好看又好用的学术工具了！强推 🔥',
    avatar: '👨‍💻',
    rating: 5,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStart = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-emerald-200/40 to-cyan-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-to-br from-amber-200/40 to-rose-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400/60 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-emerald-400/60 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-amber-400/60 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 ? 'bg-white/80 backdrop-blur-2xl shadow-lg border-b border-gray-100/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">ScholarHub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            {['功能', '特色', '用户'].map((item) => (
              <a key={item} href={`#${item === '功能' ? 'features' : item === '特色' ? 'highlights' : 'testimonials'}`} 
                 className="text-sm font-medium text-gray-600 hover:text-primary transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-violet-600 text-white text-sm font-semibold rounded-2xl hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
              >
                🚀 进入应用
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-violet-600 text-white text-sm font-semibold rounded-2xl hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
                >
                  免费开始 →
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-50 to-violet-50 text-primary-700 rounded-full text-sm font-bold mb-8 shadow-lg border border-primary-100/50 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
            <span>✨ 专为学术研究者打造</span>
          </div>

          {/* Main Headline */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight transition-all duration-1000 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="bg-gradient-to-r from-gray-900 via-primary-700 to-violet-700 bg-clip-text text-transparent">
              让学术研究
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-primary-600 to-emerald-600 bg-clip-text text-transparent">
              井井有条 ✨
            </span>
          </h1>

          {/* Subheadline with emoji */}
          <p
            className={`text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            🎯 任务管理 · 💡 头脑风暴 · ⏱️ 时间追踪 · 🌲 专注森林 · 📚 知识收藏
            <br />
            <span className="text-gray-500 text-lg">一体化工具，让学习和研究更高效</span>
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <button
              onClick={handleStart}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 via-primary-600 to-violet-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all"
            >
              {user ? '🚀 进入应用' : '🌟 免费开始使用'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:border-primary-200 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-violet-50/50 transition-all hover:-translate-y-1 shadow-sm hover:shadow-lg"
            >
              查看功能
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </a>
          </div>

          {/* Highlight badges */}
          <div
            className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            {highlights.map((item) => (
              <div key={item.title} className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-default">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm font-semibold text-gray-700">{item.title}</span>
                <span className="text-xs text-gray-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-violet-50 rounded-full text-sm font-bold text-primary-600 mb-4">
              🎯 核心功能
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              五大 <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">神器</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              每个功能都经过精心设计，让你的学术之旅更加顺畅
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                href={user ? feature.href : '/login'}
                className="group relative p-8 bg-white/80 backdrop-blur rounded-3xl border border-gray-100/50 hover:border-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient orbs */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-opacity duration-500`} />
                
                {/* Emoji badge */}
                <div className="relative mb-6">
                  <span className="text-6xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {feature.emoji}
                  </span>
                </div>

                <h3 className="relative text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="relative text-gray-500 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="relative flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  <span>开始使用</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Hover decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}

            {/* CTA Card */}
            <div className="relative p-8 bg-gradient-to-br from-primary-600 via-primary-700 to-violet-700 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>
              <div className="relative text-white">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold mb-3">准备好开始了吗？</h3>
                <p className="text-primary-100 mb-6">免费注册，立即体验所有功能</p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  立即注册
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="highlights" className="py-24 px-6 bg-gradient-to-br from-gray-50/80 via-primary-50/20 to-violet-50/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-full text-sm font-bold text-emerald-600 mb-6">
                💎 为什么选择我们
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                专注、优雅、<br />
                <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">高效</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                我们精心打磨每一个细节，只为给你最舒适的使用体验。灵感来自学术期刊的宁静与专注，打造属于你的高效学习空间。
              </p>
              
              {/* Benefit items with emojis */}
              <div className="space-y-6">
                {[
                  { emoji: '🎨', title: '学术风格设计', desc: '优雅的视觉体验，专注内容本身', color: 'from-violet-500 to-purple-500' },
                  { emoji: '⚡', title: '一体化工具', desc: '减少切换成本，提升工作效率', color: 'from-amber-500 to-orange-500' },
                  { emoji: '🔒', title: '隐私安全', desc: '本地数据库，数据完全由你掌控', color: 'from-emerald-500 to-teal-500' },
                  { emoji: '💝', title: '开源免费', desc: 'MIT协议，欢迎贡献和改进', color: 'from-blue-500 to-cyan-500' },
                ].map((item, i) => (
                  <div key={item.title} className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-lg hover:-translate-x-1 transition-all">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual - Product mockup */}
            <div className="relative">
              {/* Main card */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Window header */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-pink-400" />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
                  <span className="ml-4 text-xs text-gray-400 font-medium">ScholarHub Dashboard</span>
                </div>

                {/* Mock content with emojis */}
                <div className="space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { emoji: '✅', label: '已完成', value: '12', color: 'from-blue-100 to-blue-50' },
                      { emoji: '⏳', label: '进行中', value: '5', color: 'from-amber-100 to-amber-50' },
                      { emoji: '🎯', label: '本周目标', value: '80%', color: 'from-emerald-100 to-emerald-50' },
                    ].map((stat) => (
                      <div key={stat.label} className={`p-4 bg-gradient-to-br ${stat.color} rounded-xl text-center`}>
                        <div className="text-2xl mb-1">{stat.emoji}</div>
                        <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Task list mock */}
                  <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">📋</span>
                      <span className="font-semibold text-gray-900">今日任务</span>
                    </div>
                    {['完成论文摘要 ✍️', '整理文献笔记 📚', '准备答辩 PPT 🖥️'].map((task, i) => (
                      <div key={task} className="flex items-center gap-2 py-2 text-sm text-gray-600">
                        <span>{i === 0 ? '✅' : '⬜'}</span>
                        <span className={i === 0 ? 'line-through text-gray-400' : ''}>{task}</span>
                      </div>
                    ))}
                  </div>

                  {/* Time chart mock */}
                  <div className="flex items-end gap-2 h-20 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                    {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="text-center text-xs text-gray-400">本周学习时长 ⏱️</div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-2xl">
                    🌲
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">专注中</div>
                    <div className="text-xs text-gray-500">25 分钟</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                    ⭐
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">连续学习</div>
                    <div className="text-xs text-gray-500">7 天 🔥</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-10 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl shadow-xl p-3 animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-2xl">🎉</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full text-sm font-bold text-amber-600 mb-4">
              💬 用户评价
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              大家的 <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">真实反馈</span>
            </h2>
            <p className="text-xl text-gray-500">来自真实用户的使用体验</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="relative p-8 bg-white/80 backdrop-blur rounded-3xl border border-gray-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Quote emoji */}
                <div className="absolute -top-4 left-6 text-5xl opacity-20">💬</div>
                
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-violet-100 rounded-2xl flex items-center justify-center text-3xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-primary-600 via-violet-600 to-purple-700 rounded-[3rem] p-12 md:p-16 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="absolute top-10 left-10 text-6xl animate-float opacity-20">📚</div>
            <div className="absolute bottom-10 right-10 text-6xl animate-float opacity-20" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute top-1/2 right-20 text-4xl animate-float opacity-20" style={{ animationDelay: '1s' }}>🚀</div>

            <div className="relative text-center text-white">
              <div className="text-6xl mb-6">🌟</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                准备好提升效率了吗？
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                加入 hundreds of researchers，开启高效学术之旅
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-700 text-lg font-bold rounded-2xl hover:bg-primary-50 transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1"
              >
                🚀 免费开始
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ScholarHub</span>
              <span className="text-sm text-gray-500 ml-2">v1.1.0</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">功能</a>
              <a href="#highlights" className="hover:text-white transition-colors">特色</a>
              <a href="#testimonials" className="hover:text-white transition-colors">评价</a>
              <a href="https://github.com/confession397/ScholarHub-academic-tools" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
                <Code className="w-4 h-4" />
                GitHub
              </a>
            </div>

            <div className="text-sm">
              &copy; 2026 ScholarHub. MIT License. Made with 💜
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
