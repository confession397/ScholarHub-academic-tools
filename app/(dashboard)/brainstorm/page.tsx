'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit3,
  Check,
  X,
  Download,
  Search,
  Sparkles,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

interface Note {
  id: string;
  parent_id: string | null;
  content: string;
  order_index: number;
  children?: Note[];
}

const buildTree = (notes: Note[]): Note[] => {
  const map = new Map<string, Note>();
  const roots: Note[] = [];

  notes.forEach(note => {
    map.set(note.id, { ...note, children: [] });
  });

  notes.forEach(note => {
    const node = map.get(note.id)!;
    if (note.parent_id && map.has(note.parent_id)) {
      map.get(note.parent_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

interface NoteNodeProps {
  note: Note;
  depth: number;
  onAdd: (parentId: string | null) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  maxDepth: number;
}

function NoteNode({
  note,
  depth,
  onAdd,
  onEdit,
  onDelete,
  expandedIds,
  toggleExpand,
  maxDepth,
}: NoteNodeProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const hasChildren = note.children && note.children.length > 0;
  const isExpanded = expandedIds.has(note.id);

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(note.id, editContent);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setEditing(false);
  };

  const indent = depth * 28;

  return (
    <div className="animate-fadeIn">
      <div
        className="group flex items-center gap-2 py-2.5 px-4 rounded-xl hover:bg-gray-50/80 transition-all duration-150 cursor-pointer"
        style={{ marginLeft: `${indent}px` }}
      >
        {/* Expand/Collapse */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) toggleExpand(note.id);
          }}
          className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all ${
            hasChildren
              ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              : 'invisible'
          }`}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Bullet */}
        <div
          className="w-3 h-3 rounded-full flex-shrink-0 transition-all"
          style={{
            backgroundColor: depth === 0 ? 'var(--primary-500)' : `hsl(220, 60%, ${70 - depth * 10}%)`,
            transform: isExpanded ? 'scale(1.1)' : 'scale(1)',
          }}
        />

        {/* Content */}
        {editing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-primary-300 rounded-xl outline-none focus:border-primary text-sm bg-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <span
              className="flex-1 text-gray-700 text-base"
              onClick={() => {
                if (hasChildren) toggleExpand(note.id);
              }}
            >
              {note.content}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {depth < maxDepth && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(note.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                  title="添加子节点"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="编辑"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="border-l-2 border-gray-100" style={{ marginLeft: `${indent + 18}px` }}>
          {note.children!.map(child => (
            <NoteNode
              key={child.id}
              note={child}
              depth={depth + 1}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrainstormPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [newNoteContent, setNewNoteContent] = useState('');
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDepth] = useState(8);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data.notes || []);
      const allIds = new Set<string>((data.notes || []).map((n: Note) => n.id));
      setExpandedIds(allIds);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (parentId: string | null) => {
    setAddingTo(parentId);
    setNewNoteContent('');
  };

  const handleSubmitNew = async (parentId: string | null) => {
    if (!newNoteContent.trim()) return;

    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNoteContent,
          parent_id: parentId,
        }),
      });
      setNewNoteContent('');
      setAddingTo(null);
      loadNotes();
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleEdit = async (id: string, content: string) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      loadNotes();
    } catch (error) {
      console.error('Failed to edit note:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个笔记及其所有子节点吗？')) return;

    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      loadNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExport = () => {
    const exportNotes = (noteList: Note[], depth = 0): string => {
      return noteList
        .map(note => {
          const indent = '  '.repeat(depth);
          let result = `${indent}- ${note.content}`;
          if (note.children && note.children.length > 0) {
            result += '\n' + exportNotes(note.children, depth + 1);
          }
          return result;
        })
        .join('\n');
    };

    const tree = buildTree(notes);
    const markdown = exportNotes(tree);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brainstorm-notes.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tree = buildTree(notes);

  const filterNotes = (noteList: Note[], query: string): Note[] => {
    if (!query) return noteList;
    return noteList.filter(note => {
      const matches = note.content.toLowerCase().includes(query.toLowerCase());
      const filteredChildren = filterNotes(note.children || [], query);
      if (filteredChildren.length > 0) {
        note.children = filteredChildren;
        return true;
      }
      return matches;
    });
  };

  const filteredTree = filterNotes(tree, searchQuery);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">头脑风暴</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-500" />
            用无限层级的大纲整理复杂思路，支持导出 Markdown
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          导出 Markdown
        </button>
      </div>

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索笔记..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 outline-none transition-all"
          />
        </div>
        <button
          onClick={() => handleAddNote(null)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          添加主题
        </button>
      </div>

      {/* Add New Note Input */}
      {addingTo !== null && (
        <div className="bg-white rounded-2xl border-2 border-primary-200/50 p-5 animate-scaleIn shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <input
              type="text"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="输入内容... (按 Enter 确认, Esc 取消)"
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary outline-none text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmitNew(addingTo);
                if (e.key === 'Escape') {
                  setAddingTo(null);
                  setNewNoteContent('');
                }
              }}
            />
            <button
              onClick={() => handleSubmitNew(addingTo)}
              className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              确认
            </button>
            <button
              onClick={() => {
                setAddingTo(null);
                setNewNoteContent('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Notes Tree */}
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : filteredTree.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {searchQuery ? '没有找到匹配的笔记' : '暂无笔记'}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {searchQuery ? '尝试其他关键词' : '点击右上角按钮添加你的第一个主题'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleAddNote(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加主题
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 space-y-1">
            {filteredTree.map(note => (
              <NoteNode
                key={note.id}
                note={note}
                depth={0}
                onAdd={handleAddNote}
                onEdit={handleEdit}
                onDelete={handleDelete}
                expandedIds={expandedIds}
                toggleExpand={toggleExpand}
                maxDepth={maxDepth}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-50/50 rounded-2xl p-5 border border-primary-100/50">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-500" />
          使用技巧
        </h3>
        <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            点击节点前的箭头可展开/折叠子节点
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            使用工具按钮添加子节点、编辑或删除
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            支持导出为 Markdown 格式
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            最多支持 {maxDepth} 层嵌套
          </li>
        </ul>
      </div>
    </div>
  );
}
