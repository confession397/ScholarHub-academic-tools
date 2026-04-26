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
      const data = await res.json();
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
        body: JSON.stringify({ name: newProjectName }),
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">时间追踪</h1>
        <p className="text-gray-600 mt-1">记录你的工作时间，事后复盘时间花在哪里</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatDuration(stats.todayMinutes * 60)}
          </p>
          <p className="text-sm text-gray-500">今日</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatDuration(stats.weekMinutes * 60)}
          </p>
          <p className="text-sm text-gray-500">本周</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
          <p className="text-sm text-gray-500">项目数</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
          <p className="text-sm text-gray-500">记录数</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="text-6xl font-mono font-bold text-gray-900 mb-2">
                {formatTime(elapsed)}
              </div>
              <p className="text-gray-500">
                {tracking ? '正在追踪...' : '点击开始记录时间'}
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex flex-col items-center gap-4">
              {!tracking ? (
                <>
                  {/* Project Selection */}
                  <div className="w-full max-w-md flex gap-2">
                    <select
                      value={currentEntry?.project_id || ''}
                      onChange={(e) => setCurrentEntry({ ...currentEntry!, project_id: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option value="">选择项目</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={currentEntry?.description || ''}
                    onChange={(e) => setCurrentEntry({ ...currentEntry!, description: e.target.value })}
                    placeholder="描述你正在做什么..."
                    className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                  <button
                    onClick={startTracking}
                    className="flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    开始计时
                  </button>
                </>
              ) : (
                <button
                  onClick={stopTracking}
                  className="flex items-center gap-2 px-8 py-4 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                >
                  <Square className="w-5 h-5" />
                  停止计时
                </button>
              )}
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">最近记录</h2>
            <div className="space-y-3">
              {entries.slice(0, 10).map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
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
                    <span className="font-mono font-medium text-gray-900">
                      {formatDuration(entry.duration)}
                    </span>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <p className="text-center text-gray-500 py-8">暂无记录</p>
              )}
            </div>
          </div>
        </div>

        {/* Projects Sidebar */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">项目</h2>
              <button
                onClick={() => setShowNewProject(!showNewProject)}
                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showNewProject && (
              <form onSubmit={handleCreateProject} className="mb-4 animate-fadeIn">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="项目名称"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-2 outline-none focus:border-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  创建
                </button>
              </form>
            )}

            <div className="space-y-2">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="font-medium text-gray-700">{project.name}</span>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-center text-gray-500 py-4">暂无项目</p>
              )}
            </div>
          </div>

          {/* Time Distribution */}
          {stats.projectStats.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">时间分布</h2>
              <div className="space-y-3">
                {stats.projectStats.slice(0, 5).map((stat, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stat.color }}
                        />
                        <span className="text-sm text-gray-700">{stat.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDuration(stat.total)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
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
