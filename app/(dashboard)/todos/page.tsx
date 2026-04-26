'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  Target,
  Trash2,
  Edit3,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  Check,
  X,
  Search,
  ListTodo,
  Filter,
} from 'lucide-react';

interface Todo {
  id: string;
  content: string;
  due_type: 'today' | 'week' | 'longterm';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  created_at: string;
}

const tabs = [
  { id: 'today', label: '今天必须做', icon: Calendar, color: 'from-blue-500 to-blue-600', bgActive: 'bg-blue-50', textActive: 'text-blue-600' },
  { id: 'week', label: '这周必须做', icon: Clock, color: 'from-violet-500 to-violet-600', bgActive: 'bg-violet-50', textActive: 'text-violet-600' },
  { id: 'longterm', label: '长期目标', icon: Target, color: 'from-amber-500 to-amber-600', bgActive: 'bg-amber-50', textActive: 'text-amber-600' },
];

const priorityConfig = {
  high: { label: '高', color: 'text-red-500', bg: 'bg-red-50 border-red-200', icon: ArrowUp },
  medium: { label: '中', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', icon: Minus },
  low: { label: '低', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200', icon: ArrowDown },
};

const emptyEmojis = ['📋', '✨', '🎯', '💪'];

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTab, setActiveTab] = useState('today');
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setAdding(true);
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newTodo,
          due_type: activeTab,
          priority: 'medium',
        }),
      });

      if (res.ok) {
        setNewTodo('');
        loadTodos();
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleToggleStatus = async (todo: Todo) => {
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed';

    try {
      await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      loadTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      loadTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleEdit = async (todo: Todo) => {
    if (editContent.trim()) {
      try {
        await fetch(`/api/todos/${todo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: editContent }),
        });
        setEditingId(null);
        setEditContent('');
        loadTodos();
      } catch (error) {
        console.error('Failed to edit todo:', error);
      }
    }
  };

  const handlePriorityChange = async (todo: Todo, priority: 'high' | 'medium' | 'low') => {
    try {
      await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      });
      loadTodos();
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (activeTab === 'today') {
      if (!todo.due_type || todo.due_type === 'today') return true;
    }
    if (todo.due_type !== activeTab) return false;
    if (filterPriority && todo.priority !== filterPriority) return false;
    if (!showCompleted && todo.status === 'completed') return false;
    return true;
  });

  const stats = {
    today: todos.filter(t => !t.due_type || t.due_type === 'today').length,
    week: todos.filter(t => t.due_type === 'week').length,
    longterm: todos.filter(t => t.due_type === 'longterm').length,
    completed: todos.filter(t => t.status === 'completed').length,
    pending: todos.filter(t => t.status !== 'completed').length,
  };

  const currentTab = tabs.find(t => t.id === activeTab)!;
  const [emptyEmoji] = useState(() => emptyEmojis[Math.floor(Math.random() * emptyEmojis.length)]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center shadow-sm">
            <ListTodo className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-2">
              任务清单
              <span className="text-2xl">📋</span>
            </h1>
            <p className="text-gray-500 mt-0.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-500" />
              用自然语言添加任务，智能识别时间和优先级
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: '今日', value: stats.today, color: 'from-blue-500 to-blue-600', emoji: '📅' },
          { label: '本周', value: stats.week, color: 'from-violet-500 to-violet-600', emoji: '📆' },
          { label: '长期', value: stats.longterm, color: 'from-amber-500 to-amber-600', emoji: '🎯' },
          { label: '待办', value: stats.pending, color: 'from-gray-500 to-gray-600', emoji: '⏳' },
          { label: '已完成', value: stats.completed, color: 'from-emerald-500 to-emerald-600', emoji: '✅' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.emoji}</span>
              <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </span>
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 w-fit shadow-sm">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.bgActive} ${tab.textActive} shadow-sm`
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="输入任务内容... (如: 写论文初稿 高优先级)"
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 focus:bg-white outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newTodo.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            添加任务
          </button>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400" /> 高优先级
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> 中优先级
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> 低优先级
          </span>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="font-medium">筛选:</span>
        </div>
        <button
          onClick={() => setFilterPriority(null)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
            !filterPriority 
              ? 'bg-gray-900 text-white shadow-sm' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {Object.entries(priorityConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilterPriority(filterPriority === key ? null : key)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
              filterPriority === key 
                ? `${config.bg} ${config.color} shadow-sm` 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {config.label}优先级
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <input
            type="checkbox"
            id="showCompleted"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="showCompleted" className="text-sm text-gray-600">显示已完成</label>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-gray-500">加载中...</p>
            </div>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <span className="text-5xl">{emptyEmoji}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无任务</h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                {activeTab === 'today' 
                  ? '今天没有待办任务，太棒了！🎉' 
                  : '添加你的第一个任务，开启高效之旅'}
              </p>
              <button
                onClick={() => document.querySelector('input')?.focus()}
                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加任务
              </button>
            </div>
          </div>
        ) : (
          filteredTodos.map((todo, index) => {
            const priority = priorityConfig[todo.priority];
            const PriorityIcon = priority.icon;

            return (
              <div
                key={todo.id}
                className={`group bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-200 hover:shadow-md hover:border-gray-200/50 animate-fadeIn ${
                  todo.status === 'completed' ? 'opacity-60' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(todo)}
                    className="mt-1 flex-shrink-0 transition-transform hover:scale-110"
                  >
                    {todo.status === 'completed' ? (
                      <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : todo.status === 'in_progress' ? (
                      <div className="w-7 h-7 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-primary transition-colors" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1 px-3 py-1.5 border-2 border-primary-300 rounded-lg outline-none focus:border-primary text-sm bg-white"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleEdit(todo);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button
                          onClick={() => handleEdit(todo)}
                          className="p-2 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-lg hover:shadow-md transition-all"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className={`text-gray-900 text-base leading-relaxed ${todo.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                        {todo.content}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <button
                        onClick={() => handlePriorityChange(todo, todo.priority === 'high' ? 'medium' : todo.priority === 'medium' ? 'low' : 'high')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all hover:shadow-sm ${priority.bg} ${priority.color}`}
                      >
                        <PriorityIcon className="w-3 h-3" />
                        {priority.label}优先级
                      </button>

                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        todo.due_type === 'today' ? 'bg-blue-50 text-blue-600' :
                        todo.due_type === 'week' ? 'bg-violet-50 text-violet-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {todo.due_type === 'today' ? <Calendar className="w-3 h-3" /> :
                         todo.due_type === 'week' ? <Clock className="w-3 h-3" /> :
                         <Target className="w-3 h-3" />}
                        {todo.due_type === 'today' ? '今日' : todo.due_type === 'week' ? '本周' : '长期'}
                      </span>

                      {todo.due_date && (
                        <span className="text-xs text-gray-400">
                          {new Date(todo.due_date).toLocaleDateString('zh-CN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditContent(todo.content);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
