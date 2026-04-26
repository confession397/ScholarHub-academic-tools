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
  Zap,
  Shield,
  Globe,
  GraduationCap,
  Target,
  BarChart3,
  Coffee,
  Library,
  Timer,
} from 'lucide-react';

const features = [
  {
    icon: CheckSquare,
    title: '任务清单',
    description: '自然语言识别时间和优先级，智能分类今天、本周、长期任务',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    href: '/todos',
  },
  {
    icon: Brain,
    title: '头脑风暴',
    description: '无限层级大纲笔记，用思维导图整理复杂思路',
    color: 'from-violet-400 to-violet-600',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-500',
    href: '/brainstorm',
  },
  {
    icon: Clock,
    title: '时间追踪',
    description: '记录每分每秒，分析时间分布，助力高效复盘',
    color: 'from-amber-400 to-amber-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-500',
    href: '/time-tracker',
  },
  {
    icon: TreePine,
    title: '专注森林',
    description: '番茄工作法，种植你的专注森林，保持深度专注',
    color: 'from-emerald-400 to-emerald-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    href: '/focus',
  },
  {
    icon: Bookmark,
    title: '知识收藏',
    description: '干净保存网页内容，构建你的个人知识库',
    color: 'from-rose-400 to-rose-600',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500',
    href: '/library',
  },
];

const benefits = [
  {
    icon: GraduationCap,
    title: '学术风格设计',
    description: '灵感来自学术期刊，专注内容本身',
  },
  {
    icon: Zap,
    title: '高效工作流',
    description: '一体化工具，减少切换成本',
  },
  {
    icon: Shield,
    title: '隐私安全',
    description: '本地数据库，数据完全由你掌控',
  },
  {
    icon: Globe,
    title: '开源免费',
    description: 'MIT协议，欢迎贡献和改进',
  },
];

const testimonials = [
  {
    name: '李明',
    role: '计算机科学博士',
    content: 'ScholarHub 帮助我更好地管理论文写作和科研任务，它的 Academic 风格让我感到非常舒适。',
    avatar: '👨‍🎓',
  },
  {
    name: '王芳',
    role: '研二学生',
    content: '头脑风暴功能太棒了！我的文献综述思路清晰了很多，时间追踪也让我知道时间都去哪儿了。',
    avatar: '👩‍🔬',
  },
  {
    name: '张伟',
    role: '独立研究员',
    content: '简洁、实用、高效。专注森林让我能够更好地集中注意力，收藏库帮我整理了大量资料。',
    avatar: '👨‍💻',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 20 ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-serif font-bold text-gray-900">ScholarHub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              功能
            </a>
            <a href="#benefits" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              优势
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              用户评价
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
              >
                进入应用
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
                  className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
                >
                  立即开始
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-accent-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-8 shadow-sm border border-primary-100 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>专为学术研究者打造</span>
          </div>

          {/* Headline */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            让学术研究
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent">
              更加高效有序
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            整合任务管理、头脑风暴、时间追踪等工具，帮助研究者和学生
            <br className="hidden md:block" />
            更好地组织思路、管理任务、追踪时间。
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              onClick={handleStart}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-semibold rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {user ? '进入应用' : '免费开始使用'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:border-primary-200 hover:bg-primary-50/50 transition-all hover:-translate-y-1"
            >
              了解更多
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </a>
          </div>

          {/* Stats */}
          <div
            className={`mt-20 flex flex-wrap justify-center gap-8 md:gap-16 transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {[
              { value: '5+', label: '核心工具' },
              { value: '100%', label: '开源免费' },
              { value: '500+', label: '活跃用户' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-sm font-semibold text-primary-600 mb-4">
              <Target className="w-4 h-4" />
              核心功能
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              五大核心工具
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              精心设计的工具集，覆盖学术研究的各个环节
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                href={user ? feature.href : '/login'}
                className="group relative p-8 bg-white rounded-3xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className={`relative w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                <h3 className="relative text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="relative text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                <div className="relative mt-6 flex items-center gap-2 text-primary font-medium">
                  <span>立即使用</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-50 rounded-full text-sm font-semibold text-secondary-600 mb-4">
                <Star className="w-4 h-4" />
                为什么选择我们
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                学术风格的界面设计
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                灵感来自学术期刊和图书馆的宁静氛围，我们打造了一个专注、专业的界面。
                清晰的层次结构、舒适的阅读体验，让你在长时间使用时依然保持高效。
              </p>
              <div className="grid grid-cols-2 gap-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-500">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual demo */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Window header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>

                {/* Mock content */}
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />

                  <div className="mt-6 p-4 bg-primary-50 rounded-xl border-l-4 border-primary">
                    <div className="h-3 bg-primary-200/50 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-primary-100/50 rounded w-1/2" />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <div className="flex-1 h-20 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl" />
                    <div className="flex-1 h-20 bg-gradient-to-br from-secondary-100 to-secondary-50 rounded-xl" />
                    <div className="flex-1 h-20 bg-gradient-to-br from-accent-100 to-accent-50 rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg flex items-center justify-center animate-float">
                <BookOpen className="w-12 h-12 text-white" />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">效率提升</div>
                    <div className="text-xs text-gray-500">+40%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-50 rounded-full text-sm font-semibold text-accent-600 mb-4">
              <Users className="w-4 h-4" />
              用户评价
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              听听他们怎么说
            </h2>
            <p className="text-xl text-gray-600">来自真实用户的使用体验</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            准备好提升你的学术效率了吗？
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            立即加入 hundreds of researchers 使用 ScholarHub，开启高效学术之旅
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary text-lg font-bold rounded-2xl hover:bg-primary-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <Play className="w-5 h-5" />
            免费开始
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-serif font-bold text-white">ScholarHub</span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">功能</a>
              <a href="#benefits" className="hover:text-white transition-colors">优势</a>
              <a href="#testimonials" className="hover:text-white transition-colors">评价</a>
              <a href="https://github.com/confession397/ScholarHub-academic-tools" target="_blank" className="hover:text-white transition-colors">GitHub</a>
            </div>

            <div className="text-sm">
              &copy; 2026 ScholarHub. MIT License.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
