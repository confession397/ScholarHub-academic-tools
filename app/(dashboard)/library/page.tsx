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
  Sparkles,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Eye,
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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
      setSelectedItem(null);
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

  const allTags = Array.from(new Set(items.flatMap(item => parseTags(item.tags))));

  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.url.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query) ||
      item.tags.toLowerCase().includes(query);

    const matchesTag = !selectedTag || parseTags(item.tags).includes(selectedTag);

    return matchesSearch && matchesTag;
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
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-500" />
            保存和整理重要的网页内容，构建你的个人知识库
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          添加收藏
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100/80 p-5">
          <div className="text-3xl font-bold text-gray-900">{items.length}</div>
          <div className="text-sm text-gray-500 mt-1">总收藏数</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100/80 p-5">
          <div className="text-3xl font-bold text-gray-900">{allTags.length}</div>
          <div className="text-sm text-gray-500 mt-1">标签数</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100/80 p-5">
          <div className="text-3xl font-bold text-gray-900">
            {items.filter(i => new Date(i.created_at).toDateString() === new Date().toDateString()).length}
          </div>
          <div className="text-sm text-gray-500 mt-1">今日新增</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索收藏..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${!selectedTag ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            全部
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1.5 ${selectedTag === tag ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Items Grid/List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            {searchQuery || selectedTag ? '没有找到匹配的收藏' : '暂无收藏'}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {searchQuery || selectedTag ? '尝试其他关键词' : '点击右上角添加你的第一个收藏'}
          </p>
          {!searchQuery && !selectedTag && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加收藏
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-2xl border border-gray-100/80 p-6 hover:shadow-lg hover:border-gray-200/50 transition-all duration-300 cursor-pointer animate-fadeIn hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Link2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {item.title || extractDomain(item.url)}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {item.excerpt || item.url}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString('zh-CN')}
                </div>
                {parseTags(item.tags).length > 0 && (
                  <div className="flex items-center gap-1">
                    {parseTags(item.tags).slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {parseTags(item.tags).length > 2 && (
                      <span className="text-xs text-gray-400">+{parseTags(item.tags).length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100/80 divide-y divide-gray-100">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.title || extractDomain(item.url)}</p>
                <p className="text-sm text-gray-500 truncate">{item.url}</p>
              </div>
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {parseTags(item.tags).slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {tag}
                  </span>
                ))}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">添加收藏</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL链接 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  标题（可选）
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="输入标题"
                  className="w-full px-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  摘要（可选）
                </label>
                <textarea
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="简要描述这个内容..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  标签（可选，用逗号分隔）
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="研究, 论文, 教程"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving || !newUrl.trim()}
                  className="flex-1 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">
                    {selectedItem.title || extractDomain(selectedItem.url)}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    {selectedItem.url}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {selectedItem.excerpt && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">摘要</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedItem.excerpt}</p>
                </div>
              )}
              {parseTags(selectedItem.tags).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {parseTags(selectedItem.tags).map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-600 text-sm font-medium rounded-full">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                收藏于 {new Date(selectedItem.created_at).toLocaleString('zh-CN')}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                访问原文
              </a>
              <button
                onClick={() => handleDelete(selectedItem.id)}
                className="py-3 px-6 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
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
