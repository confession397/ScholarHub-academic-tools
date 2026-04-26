'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  Circle,
  MoreVertical,
  Trash2,
  Edit3,
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
  { id: 'today', label: '今天必须做', icon: Calendar },
  { id: 'week', label: '这周必须做', icon: Clock },
  { id: 'longterm', label: '长期目标', icon: Target },
];

const priorityColors = {
  high: 'text-red-500 bg-red-50 border-red-200',
  medium: 'text-amber-500 bg-amber-50 border-amber-200',
  low: 'text-green-500 bg-green-50 border-green-200',
};

const priorityLabels = {
  high: '高',
  medium: '中',
  low: '低',
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTab, setActiveTab] = useState('today');
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

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

  const filteredTodos = todos.filter(todo => {
    if (activeTab === 'today') {
      return todo.due_type === 'today' || (!todo.due_type);
    }
    return todo.due_type === activeTab;
  });

  const stats = {
    today: todos.filter(t => t.due_type === 'today').length,
    week: todos.filter(t => t.due_type === 'week').length,
    longterm: todos.filter(t => t.due_type === 'longterm').length,
    completed: todos.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">任务清单</h1>
        <p className="text-gray-600 mt-1">用自然语言添加任务，支持时间和优先级设置</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
          <p className="text-sm text-gray-500">今日任务</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-2xl font-bold text-purple-600">{stats.week}</p>
          <p className="text-sm text-gray-500">本周任务</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-2xl font-bold text-gray-600">{stats.longterm}</p>
          <p className="text-sm text-gray-500">长期目标</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-gray-500">已完成</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="输入任务内容... (如: 写论文初稿 今天必须做 高优先级)"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
          <button
            type="submit"
            disabled={adding || !newTodo.trim()}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            添加
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          提示: 输入&quot;今天&quot;/&quot;这周&quot;/&quot;长期&quot;设置时间，&quot;高&quot;/&quot;中&quot;/&quot;低&quot;设置优先级
        </p>
      </form>

      {/* Todo List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无任务</p>
            <p className="text-sm text-gray-400 mt-1">添加你的第一个任务吧</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`bg-white rounded-xl border border-gray-100 p-4 transition-all hover:shadow-md ${
                todo.status === 'completed' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleStatus(todo)}
                  className="mt-1 flex-shrink-0"
                >
                  {todo.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : todo.status === 'in_progress' ? (
                    <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-50" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  {editingId === todo.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-200 rounded-lg outline-none focus:border-primary"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleEdit(todo);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => handleEdit(todo)}
                        className="px-3 py-1 bg-primary text-white rounded-lg text-sm"
                      >
                        保存
                      </button>
                    </div>
                  ) : (
                    <p className={`text-gray-900 ${
                      todo.status === 'completed' ? 'line-through' : ''
                    }`}>
                      {todo.content}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[todo.priority]}`}>
                      {priorityLabels[todo.priority]}优先级
                    </span>
                    {todo.due_date && (
                      <span className="text-xs text-gray-500">
                        {new Date(todo.due_date).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditContent(todo.content);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
          ))
        )}
      </div>
    </div>
  );
}
