'use client';

import { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, TreePine, Clock, Calendar, Target, Coffee } from 'lucide-react';

interface Stats {
  todaySeconds: number;
  weekSeconds: number;
  todayMinutes: number;
  weekMinutes: number;
  todayCount: number;
  dailyStats: { date: string; total: number }[];
}

const PRESETS = [
  { label: '25分钟', duration: 25 * 60 },
  { label: '45分钟', duration: 45 * 60 },
  { label: '60分钟', duration: 60 * 60 },
];

// 树的数据
const TREES = [
  { name: '小树苗', minTime: 25 * 60, color: '#90EE90', height: 40 },
  { name: '成长中', minTime: 45 * 60, color: '#228B22', height: 60 },
  { name: '大树', minTime: 90 * 60, color: '#006400', height: 80 },
  { name: '参天大树', minTime: 180 * 60, color: '#228B22', height: 100 },
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setFocusing(false);
    setShowRest(true);

    // 记录完成的专注时段
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setFocusing(false);
    setPaused(false);
    setRemaining(duration);
    setShowRest(false);
  };

  const handlePresetClick = (presetDuration: number) => {
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
        <p className="text-gray-600 mt-1">保持专注，种植你的专注森林</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatDuration(stats.todaySeconds)}
          </p>
          <p className="text-sm text-gray-500">今日专注</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatDuration(stats.weekSeconds)}
          </p>
          <p className="text-sm text-gray-500">本周专注</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.todayCount}</p>
          <p className="text-sm text-gray-500">今日次数</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <TreePine className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentTree.name}</p>
          <p className="text-sm text-gray-500">当前森林</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            {/* Forest Visual */}
            <div className="flex justify-center mb-8">
              <div
                className="relative"
                style={{
                  width: `${currentTree.height}px`,
                  height: `${currentTree.height}px`,
                  transition: 'all 0.5s ease',
                }}
              >
                {/* Tree trunk */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 bg-amber-700 rounded"
                  style={{ height: '30%' }}
                />
                {/* Tree crown */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full transition-all duration-500"
                  style={{
                    width: '100%',
                    height: '80%',
                    backgroundColor: currentTree.color,
                    opacity: focusing ? 0.5 + (progress / 200) : 0.8,
                  }}
                />
                {/* Progress ring */}
                {focusing && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="#5B8C5A"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="text-6xl font-mono font-bold text-gray-900 mb-2">
                {formatTime(remaining)}
              </div>
              <p className="text-gray-500">
                {focusing
                  ? paused
                    ? '已暂停'
                    : '专注中...'
                  : showRest
                  ? '太棒了！休息一下吧'
                  : '选择一个时长开始专注'}
              </p>
            </div>

            {/* Presets */}
            {!focusing && !showRest && (
              <div className="flex justify-center gap-3 mb-8">
                {PRESETS.map(preset => (
                  <button
                    key={preset.duration}
                    onClick={() => handlePresetClick(preset.duration)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      duration === preset.duration
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {!focusing ? (
                <>
                  <button
                    onClick={startFocus}
                    className="flex items-center gap-2 px-8 py-4 bg-secondary text-white font-medium rounded-xl hover:bg-secondary-600 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    开始专注
                  </button>
                </>
              ) : (
                <>
                  {paused ? (
                    <button
                      onClick={resumeFocus}
                      className="flex items-center gap-2 px-6 py-4 bg-secondary text-white font-medium rounded-xl hover:bg-secondary-600 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      继续
                    </button>
                  ) : (
                    <button
                      onClick={pauseFocus}
                      className="flex items-center gap-2 px-6 py-4 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
                    >
                      <Pause className="w-5 h-5" />
                      暂停
                    </button>
                  )}
                  <button
                    onClick={resetFocus}
                    className="flex items-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    重置
                  </button>
                </>
              )}
            </div>

            {/* Rest Message */}
            {showRest && (
              <div className="mt-8 p-6 bg-secondary/10 rounded-xl text-center animate-fadeIn">
                <Coffee className="w-12 h-12 text-secondary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专注完成！</h3>
                <p className="text-gray-600 mb-4">你已专注了 {formatDuration(duration)}，休息一下吧</p>
                <button
                  onClick={() => {
                    setShowRest(false);
                    setRemaining(duration);
                  }}
                  className="px-6 py-3 bg-secondary text-white font-medium rounded-xl hover:bg-secondary-600 transition-colors"
                >
                  再来一次
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Tree Evolution */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">森林成长</h2>
            <div className="space-y-4">
              {TREES.map((tree, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    stats.todaySeconds >= tree.minTime
                      ? 'bg-secondary/10'
                      : 'bg-gray-50'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: tree.color }}
                  >
                    <TreePine className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tree.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDuration(tree.minTime)}
                      {stats.todaySeconds >= tree.minTime && (
                        <span className="text-secondary ml-2">✓</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl border border-secondary/20 p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">番茄工作法技巧</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 专注25分钟，休息5分钟</li>
              <li>• 休息时离开座位活动一下</li>
              <li>• 每4个番茄钟后长休息</li>
              <li>• 保持手机静音或远离</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
