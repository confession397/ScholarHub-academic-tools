'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Bookmark,
  Link2,
  Trash2,
  ExternalLink,
  Search,
  Tag,
  X,
  Save,
  Loader2,
} from 'lucide-react';

interface LibraryItem {
  id: string;
  url: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  created_at: string;
}

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newTags, setNewTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/library');
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newUrl,
          title: newTitle || extractDomain(newUrl),
          excerpt: newExcerpt,
          tags: newTags,
        }),
      });

      if (res.ok) {
        setNewUrl('');
        setNewTitle('');
        setNewExcerpt('');
        setNewTags('');
        setShowAddModal(false);
        loadItems();
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个收藏吗？')) return;

    try {
      await fetch(`/api/library/${id}`, { method: 'DELETE' });
      loadItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const extractDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.url.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query) ||
      item.tags.toLowerCase().includes(query)
    );
  });

  const parseTags = (tags: string) => {
    if (!tags) return [];
    return tags.split(',').map(t => t.trim()).filter(Boolean);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">收藏库</h1>
          <p className="text-gray-600 mt-1">保存和整理重要的网页内容</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          添加收藏
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索收藏..."
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            加载中...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无收藏</p>
            <p className="text-sm text-gray-400 mt-1">点击右上角添加你的第一个收藏</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Link2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title || extractDomain(item.url)}
              </h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {item.excerpt || item.url}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString('zh-CN')}
                </span>
                {parseTags(item.tags).length > 0 && (
                  <div className="flex items-center gap-1">
                    {parseTags(item.tags).slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {parseTags(item.tags).length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{parseTags(item.tags).length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl w-full max-w-lg p-6 animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-gray-900">添加收藏</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL链接
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标题（可选）
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="输入标题"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  摘要（可选）
                </label>
                <textarea
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="简要描述这个内容..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签（可选，用逗号分隔）
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="研究, 论文, 教程"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving || !newUrl.trim()}
                  className="flex-1 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      保存
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">
                    {selectedItem.title || extractDomain(selectedItem.url)}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedItem.url}</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedItem.excerpt && (
                <p className="text-gray-700 mb-4">{selectedItem.excerpt}</p>
              )}
              {parseTags(selectedItem.tags).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {parseTags(selectedItem.tags).map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors text-center flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                访问原文
              </a>
              <button
                onClick={() => {
                  handleDelete(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="py-3 px-6 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
