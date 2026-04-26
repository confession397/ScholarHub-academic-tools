'use client';

import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, TreePine, Clock, Calendar, Target, Coffee, Sparkles, ChevronDown, Check } from 'lucide-react';

interface Stats {
  todaySeconds: number;
  weekSeconds: number;
  todayMinutes: number;
  weekMinutes: number;
  todayCount: number;
  dailyStats: { date: string; total: number }[];
}

const PRESETS = [
  { label: '15分钟', duration: 15 * 60, emoji: '🌱', color: '#90EE90' },
  { label: '25分钟', duration: 25 * 60, emoji: '🌿', color: '#228B22' },
  { label: '45分钟', duration: 45 * 60, emoji: '🌲', color: '#006400' },
  { label: '60分钟', duration: 60 * 60, emoji: '🌳', color: '#2E8B57' },
];

const TREES = [
  { name: '小树苗', minTime: 15 * 60, emoji: '🌱', color: '#90EE90', size: 50 },
  { name: '嫩芽', minTime: 25 * 60, emoji: '🌿', color: '#98FB98', size: 65 },
  { name: '小树', minTime: 45 * 60, emoji: '🌲', color: '#228B22', size: 80 },
  { name: '大树', minTime: 90 * 60, emoji: '🌳', color: '#006400', size: 95 },
  { name: '参天大树', minTime: 180 * 60, emoji: '🌲🌳', color: '#2E8B57', size: 110 },
];

export default function FocusPage() {
  const [stats, setStats] = useState<Stats>({
    todaySeconds: 0,
    weekSeconds: 0,
    todayMinutes: 0,
    weekMinutes: 0,
    todayCount: 0,
    dailyStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [focusing, setFocusing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [showRest, setShowRest] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/focus/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const getCurrentTree = () => {
    return TREES.find(tree => stats.todaySeconds >= tree.minTime) || TREES[0];
  };

  const startFocus = () => {
    setFocusing(true);
    setPaused(false);

    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          completeFocus();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseFocus = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPaused(true);
  };

  const resumeFocus = () => {
    setPaused(false);
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          completeFocus();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeFocus = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFocusing(false);
    setShowRest(true);

    try {
      await fetch('/api/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: duration }),
      });
      loadStats();
    } catch (error) {
      console.error('Failed to record focus session:', error);
    }
  };

  const resetFocus = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFocusing(false);
    setPaused(false);
    setRemaining(duration);
    setShowRest(false);
  };

  const handlePresetClick = (index: number, presetDuration: number) => {
    setSelectedPreset(index);
    setDuration(presetDuration);
    setRemaining(presetDuration);
  };

  const progress = focusing ? ((duration - remaining) / duration) * 100 : 0;
  const currentTree = getCurrentTree();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">专注森林</h1>
        <p className="text-gray-500 mt-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-500" />
          保持专注，种植你的专注森林
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: '今日专注', value: formatDuration(stats.todaySeconds), gradient: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50' },
          { icon: Calendar, label: '本周专注', value: formatDuration(stats.weekSeconds), gradient: 'from-teal-400 to-teal-600', bg: 'bg-teal-50' },
          { icon: Target, label: '今日次数', value: stats.todayCount, gradient: 'from-amber-400 to-amber-600', bg: 'bg-amber-50' },
          { icon: TreePine, label: '当前阶段', value: currentTree.name, gradient: 'from-secondary-400 to-secondary-600', bg: 'bg-secondary-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100/80 p-5 hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" style={{ color: stat.gradient.includes('emerald') ? '#10B981' : stat.gradient.includes('teal') ? '#14B8A6' : stat.gradient.includes('amber') ? '#F59E0B' : '#5B8C5A' }} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100/80 p-8 shadow-sm">
            {/* Forest Visual */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Tree display */}
                <div className="text-8xl animate-bounce" style={{ animationDuration: '3s' }}>
                  {focusing ? PRESETS[selectedPreset].emoji : currentTree.emoji}
                </div>

                {/* Progress ring */}
                {focusing && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="url(#focusGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5B8C5A" />
                        <stop offset="100%" stopColor="#228B22" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className={`text-7xl font-mono font-bold text-gray-900 mb-3 ${focusing && !paused ? 'animate-pulse' : ''}`}>
                {formatTime(remaining)}
              </div>
              <p className="text-gray-500 text-lg">
                {focusing
                  ? paused
                    ? '⏸️ 已暂停'
                    : '🌱 专注中...'
                  : showRest
                  ? '🎉 太棒了！'
                  : '选择一个时长开始专注'}
              </p>
            </div>

            {/* Presets */}
            {!focusing && !showRest && (
              <div className="flex justify-center gap-3 mb-8">
                {PRESETS.map((preset, index) => (
                  <button
                    key={preset.duration}
                    onClick={() => handlePresetClick(index, preset.duration)}
                    className={`px-5 py-3 rounded-2xl font-medium transition-all duration-200 ${
                      selectedPreset === index
                        ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-lg mr-1">{preset.emoji}</span>
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {!focusing ? (
                <button
                  onClick={startFocus}
                  className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-2xl hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
                >
                  <Play className="w-6 h-6" />
                  开始专注
                </button>
              ) : (
                <>
                  {paused ? (
                    <button
                      onClick={resumeFocus}
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-2xl hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Play className="w-6 h-6" />
                      继续
                    </button>
                  ) : (
                    <button
                      onClick={pauseFocus}
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Pause className="w-6 h-6" />
                      暂停
                    </button>
                  )}
                  <button
                    onClick={resetFocus}
                    className="flex items-center gap-3 px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    重置
                  </button>
                </>
              )}
            </div>

            {/* Rest Message */}
            {showRest && (
              <div className="mt-8 p-6 bg-gradient-to-br from-secondary-50 to-secondary-50/50 rounded-2xl text-center animate-fadeIn border border-secondary-100">
                <div className="text-6xl mb-4">{PRESETS[selectedPreset].emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">专注完成！🎉</h3>
                <p className="text-gray-600 mb-4">
                  你已专注了 {formatDuration(duration)}，休息一下吧
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setShowRest(false);
                      setRemaining(duration);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all shadow-md"
                  >
                    再来一次
                  </button>
                  <button
                    onClick={() => {
                      setShowRest(false);
                      setRemaining(duration);
                    }}
                    className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    完成
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Tree Evolution */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TreePine className="w-5 h-5 text-secondary" />
              森林成长
            </h2>
            <div className="space-y-3">
              {TREES.map((tree, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    stats.todaySeconds >= tree.minTime
                      ? 'bg-secondary-50 border border-secondary-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="text-2xl">{tree.emoji}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{tree.name}</p>
                    <p className="text-xs text-gray-500">{formatDuration(tree.minTime)}</p>
                  </div>
                  {stats.todaySeconds >= tree.minTime && (
                    <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-secondary-50 to-secondary-50/50 rounded-2xl border border-secondary-100/50 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              番茄工作法技巧
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <span>🍅</span> 专注25分钟，休息5分钟
              </li>
              <li className="flex items-center gap-2">
                <span>🚶</span> 休息时离开座位活动一下
              </li>
              <li className="flex items-center gap-2">
                <span>☕</span> 每4个番茄钟后长休息
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span> 保持手机静音或远离
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
