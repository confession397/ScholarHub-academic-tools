'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  MoreHorizontal,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  Check,
  X,
  Search,
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
  { id: 'today', label: '今天必须做', icon: Calendar, color: 'text-blue-500', bgActive: 'bg-blue-50' },
  { id: 'week', label: '这周必须做', icon: Clock, color: 'text-violet-500', bgActive: 'bg-violet-50' },
  { id: 'longterm', label: '长期目标', icon: Target, color: 'text-amber-500', bgActive: 'bg-amber-50' },
];

const priorityConfig = {
  high: { label: '高', color: 'text-red-500', bg: 'bg-red-50 border-red-200', icon: ArrowUp },
  medium: { label: '中', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', icon: Minus },
  low: { label: '低', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200', icon: ArrowDown },
};

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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">任务清单</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-500" />
            用自然语言添加任务，智能识别时间和优先级
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: '今日', value: stats.today, color: 'from-blue-500 to-blue-600' },
          { label: '本周', value: stats.week, color: 'from-violet-500 to-violet-600' },
          { label: '长期', value: stats.longterm, color: 'from-amber-500 to-amber-600' },
          { label: '待办', value: stats.pending, color: 'from-gray-500 to-gray-600' },
          { label: '已完成', value: stats.completed, color: 'from-emerald-500 to-emerald-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100/80 p-4 hover:shadow-md transition-all">
            <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-gray-100/80 w-fit shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.bgActive} ${tab.color} shadow-sm`
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="bg-white rounded-2xl border border-gray-100/80 p-5 shadow-sm">
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
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-4">
          <span>提示: 输入&quot;高/中/低&quot;设置优先级</span>
          <span>•</span>
          <span>输入&quot;今天/这周/长期&quot;设置时间</span>
        </p>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-600">筛选:</span>
        <button
          onClick={() => setFilterPriority(null)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-all ${!filterPriority ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          全部
        </button>
        {Object.entries(priorityConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilterPriority(filterPriority === key ? null : key)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${filterPriority === key ? config.bg + ' ' + config.color : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">暂无任务</p>
            <p className="text-sm text-gray-400">添加你的第一个任务吧</p>
          </div>
        ) : (
          filteredTodos.map((todo, index) => {
            const priority = priorityConfig[todo.priority];
            const PriorityIcon = priority.icon;

            return (
              <div
                key={todo.id}
                className={`group bg-white rounded-2xl border border-gray-100/80 p-5 transition-all duration-200 hover:shadow-md hover:border-gray-200/50 animate-fadeIn ${
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
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : todo.status === 'in_progress' ? (
                      <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-50" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-primary transition-colors" />
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
                          className="flex-1 px-3 py-1.5 border-2 border-primary-300 rounded-lg outline-none focus:border-primary text-sm"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleEdit(todo);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button
                          onClick={() => handleEdit(todo)}
                          className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className={`text-gray-900 text-base ${todo.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                        {todo.content}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handlePriorityChange(todo, todo.priority === 'high' ? 'medium' : todo.priority === 'medium' ? 'low' : 'high')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${priority.bg} ${priority.color} hover:opacity-80`}
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
