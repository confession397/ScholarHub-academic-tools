'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Play,
  Square,
  Plus,
  Clock,
  Trash2,
  FolderKanban,
  Calendar,
  TrendingUp,
  Timer,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface TimeEntry {
  id: string;
  project_id?: string;
  project_name?: string;
  project_color?: string;
  todo_content?: string;
  description?: string;
  start_time: string;
  end_time?: string;
  duration: number;
}

interface Stats {
  todayMinutes: number;
  weekMinutes: number;
  projectStats: { name: string; color: string; total: number }[];
}

const COLORS = ['#2D4A6F', '#5B8C5A', '#C9A227', '#DC2626', '#7C3AED', '#2563EB', '#059669', '#F59E0B'];

export default function TimeTrackerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [stats, setStats] = useState<Stats>({ todayMinutes: 0, weekMinutes: 0, projectStats: [] });
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<{ project_id?: string; description: string } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectsRes, entriesRes, statsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/time-entries'),
        fetch('/api/time-entries/stats'),
      ]);
      const [projectsData, entriesData, statsData] = await Promise.all([
        projectsRes.json(),
        entriesRes.json(),
        statsRes.json(),
      ]);
      setProjects(projectsData.projects || []);
      setEntries(entriesData.entries || []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const startTracking = async () => {
    if (!currentEntry) {
      setCurrentEntry({ project_id: projects[0]?.id, description: '' });
      return;
    }

    try {
      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: currentEntry.project_id,
          description: currentEntry.description,
          start_time: new Date().toISOString(),
        }),
      });
      setTracking(true);
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start tracking:', error);
    }
  };

  const stopTracking = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      const res = await fetch('/api/time-entries');
      const data = await res.json();
      const latestEntry = data.entries?.[0];

      if (latestEntry) {
        await fetch(`/api/time-entries/${latestEntry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            end_time: new Date().toISOString(),
            duration: elapsed,
          }),
        });
      }

      setTracking(false);
      setCurrentEntry(null);
      setElapsed(0);
      loadData();
    } catch (error) {
      console.error('Failed to stop tracking:', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          color: COLORS[projects.length % COLORS.length],
        }),
      });
      setNewProjectName('');
      setShowNewProject(false);
      loadData();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await fetch(`/api/time-entries/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const selectedProject = projects.find(p => p.id === currentEntry?.project_id);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">时间追踪</h1>
        <p className="text-gray-500 mt-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-500" />
          记录你的工作时间，事后复盘时间花在哪里
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: '今日', value: formatDuration(stats.todayMinutes * 60), color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
          { icon: Calendar, label: '本周', value: formatDuration(stats.weekMinutes * 60), color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50' },
          { icon: FolderKanban, label: '项目', value: projects.length, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
          { icon: TrendingUp, label: '记录', value: entries.length, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100/80 p-5 hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: stat.color.includes('blue') ? '#3B82F6' : stat.color.includes('violet') ? '#8B5CF6' : stat.color.includes('emerald') ? '#10B981' : '#F59E0B' }} />
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
            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className={`text-7xl font-mono font-bold text-gray-900 mb-3 ${tracking ? 'animate-pulse' : ''}`}>
                  {formatTime(elapsed)}
                </div>
                {/* Progress ring */}
                {tracking && (
                  <svg className="absolute -inset-4 w-48 h-48 -rotate-90 mx-auto">
                    <circle
                      cx="96" cy="96" r="88"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                    />
                    <circle
                      cx="96" cy="96" r="88"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 88}
                      strokeDashoffset={2 * Math.PI * 88 * (1 - ((elapsed % (25 * 60)) / (25 * 60)))}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2D4A6F" />
                        <stop offset="100%" stopColor="#5B8C5A" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>
              <p className="text-gray-500 text-lg">
                {tracking ? '🔴 正在追踪...' : '准备开始记录时间'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4">
              {!tracking ? (
                <>
                  {/* Project & Description */}
                  <div className="w-full max-w-md space-y-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowProjectMenu(!showProjectMenu)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {selectedProject ? (
                            <>
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProject.color }} />
                              <span className="text-gray-700">{selectedProject.name}</span>
                            </>
                          ) : (
                            <span className="text-gray-400">选择项目</span>
                          )}
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </button>

                      {showProjectMenu && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 max-h-48 overflow-y-auto">
                          {projects.map(project => (
                            <button
                              key={project.id}
                              onClick={() => {
                                setCurrentEntry({ ...currentEntry!, project_id: project.id });
                                setShowProjectMenu(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                            >
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                              <span className="text-gray-700">{project.name}</span>
                            </button>
                          ))}
                          <button
                            onClick={() => setShowNewProject(true)}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-primary"
                          >
                            <Plus className="w-4 h-4" />
                            <span>新建项目</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      value={currentEntry?.description || ''}
                      onChange={(e) => setCurrentEntry({ ...currentEntry!, description: e.target.value })}
                      placeholder="描述你正在做什么..."
                      className="w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100/50 outline-none transition-all"
                    />
                  </div>

                  <button
                    onClick={startTracking}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <Play className="w-6 h-6" />
                    开始计时
                  </button>
                </>
              ) : (
                <button
                  onClick={stopTracking}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <Square className="w-6 h-6" />
                  停止计时
                </button>
              )}
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 mt-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              最近记录
            </h2>
            <div className="space-y-3">
              {entries.slice(0, 8).map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: entry.project_color || '#2D4A6F' }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {entry.project_name || '未分类'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {entry.description || '无描述'} · {new Date(entry.start_time).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-gray-900 bg-white px-3 py-1 rounded-lg">
                      {formatDuration(entry.duration)}
                    </span>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">暂无记录</p>
                  <p className="text-sm text-gray-400">开始追踪你的第一个时间块</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects Sidebar */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-primary" />
                项目
              </h2>
              <button
                onClick={() => setShowNewProject(!showNewProject)}
                className="p-2 text-primary hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showNewProject && (
              <form onSubmit={handleCreateProject} className="mb-4 p-4 bg-gray-50 rounded-xl animate-fadeIn">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="项目名称"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2 outline-none focus:border-primary text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600"
                  >
                    创建
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewProject(false)}
                    className="flex-1 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300"
                  >
                    取消
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => setCurrentEntry({ ...currentEntry!, project_id: project.id })}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="flex-1 font-medium text-gray-700">{project.name}</span>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-8">
                  <FolderKanban className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">暂无项目</p>
                  <button
                    onClick={() => setShowNewProject(true)}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    创建第一个项目
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Time Distribution */}
          {stats.projectStats.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100/80 p-6 mt-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                时间分布
              </h2>
              <div className="space-y-4">
                {stats.projectStats.slice(0, 5).map((stat, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                        <span className="text-sm text-gray-700">{stat.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatDuration(stat.total)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((stat.total / (stats.weekMinutes * 60 || 1)) * 100, 100)}%`,
                          backgroundColor: stat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
