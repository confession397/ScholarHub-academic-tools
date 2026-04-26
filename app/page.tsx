'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CheckSquare, Brain, Clock, TreePine, Bookmark, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  {
    icon: CheckSquare,
    title: 'TodoList',
    description: '自然语言识别时间和优先级，任务分类管理',
    color: 'bg-blue-500',
    href: '/todos',
  },
  {
    icon: Brain,
    title: 'Workflowy',
    description: '头脑风暴与结构化笔记，无限层级思维导图',
    color: 'bg-purple-500',
    href: '/brainstorm',
  },
  {
    icon: Clock,
    title: 'Toggl Track',
    description: '时间追踪与复盘，掌控每一分钟',
    color: 'bg-amber-500',
    href: '/time-tracker',
  },
  {
    icon: TreePine,
    title: 'Forest',
    description: '番茄钟专注，种植你的专注森林',
    color: 'bg-green-500',
    href: '/focus',
  },
  {
    icon: Bookmark,
    title: 'Library',
    description: '网页收藏与整理，构建个人知识库',
    color: 'bg-rose-500',
    href: '/library',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [mounted, setMounted] = useState(false);

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

  const handleStart = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-xl font-serif font-semibold text-primary">ScholarHub</span>
          </div>
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                  进入应用
                </Link>
                <div className="text-sm text-gray-500">欢迎, {user.name}</div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
                >
                  注册
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Sparkles className="w-4 h-4" />
            专为学术研究者打造
          </div>
          <h1 className={`text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            让学术研究
            <br />
            <span className="text-primary">更高效、更有序</span>
          </h1>
          <p className={`text-xl text-gray-600 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            ScholarHub 整合了任务管理、头脑风暴、时间追踪等工具，帮助研究者和学生更好地组织思路、管理任务、追踪时间。
          </p>
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={handleStart}
              className="group flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-medium rounded-xl hover:bg-primary-600 transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              {user ? '进入应用' : '开始使用'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="#features"
              className="px-8 py-4 bg-white text-gray-700 text-lg font-medium rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              五大核心工具
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              精心设计的工具集，覆盖学术研究的各个环节
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                href={user ? feature.href : '/login'}
                className={`group p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Style Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                学术风格的界面设计
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                灵感来自学术期刊和图书馆的宁静氛围，我们打造了一个专注、专业的界面。
                清晰的层次结构、舒适的阅读体验，让你在长时间使用时依然保持高效。
              </p>
              <ul className="space-y-4">
                {[
                  '精选的学术字体组合',
                  '护眼的配色方案',
                  '简洁的界面布局',
                  '流畅的交互动效',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-secondary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-32 bg-primary/5 rounded-lg mt-6 border-l-4 border-primary pl-4">
                    <div className="h-3 bg-primary/20 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-primary/10 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            准备好提升你的学术效率了吗？
          </h2>
          <p className="text-xl text-white/80 mb-10">
            立即加入 thousands of researchers 使用 ScholarHub
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary text-lg font-medium rounded-xl hover:bg-gray-100 transition-colors"
          >
            免费开始
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary-400" />
            <span className="text-lg font-serif font-semibold text-white">ScholarHub</span>
          </div>
          <p className="text-sm">
            &copy; 2026 ScholarHub. 开源项目，MIT License.
          </p>
        </div>
      </footer>
    </div>
  );
}
