'use client';

import { useEffect, useState, useCallback } from 'react';
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
  Mind,
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
}

function NoteNode({
  note,
  depth,
  onAdd,
  onEdit,
  onDelete,
  expandedIds,
  toggleExpand,
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

  return (
    <div className="animate-fadeIn">
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 group transition-colors"
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={() => toggleExpand(note.id)}
          className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
            hasChildren ? 'text-gray-400 hover:text-gray-600' : 'invisible'
          }`}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Bullet */}
        <div className="w-2 h-2 rounded-full bg-primary/40 flex-shrink-0" />

        {/* Content */}
        {editing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 px-3 py-1 border border-primary/30 rounded-lg outline-none focus:border-primary text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <span
              className="flex-1 text-gray-700 cursor-pointer"
              onClick={() => {
                if (hasChildren) toggleExpand(note.id);
              }}
            >
              {note.content}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onAdd(note.id)}
                className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded"
                title="添加子节点"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditing(true);
                }}
                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="编辑"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
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
        <div className="border-l border-primary/10 ml-5">
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

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data.notes || []);
      // 自动展开所有节点
      const allIds = new Set((data.notes || []).map((n: Note) => n.id));
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

  // 过滤搜索结果
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
          <p className="text-gray-600 mt-1">用大纲式笔记整理你的思维，支持无限层级缩进</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出 Markdown
          </button>
        </div>
      </div>

      {/* Search & Add */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索笔记..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <button
          onClick={() => handleAddNote(null)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          添加主题
        </button>
      </div>

      {/* Add New Note Input */}
      {addingTo !== null && (
        <div className="bg-white rounded-xl border border-primary/30 p-4 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Mind className="w-4 h-4 text-primary" />
            </div>
            <input
              type="text"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="输入内容... (按 Enter 确认, Esc 取消)"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmitNew(addingTo);
                if (e.key === 'Escape') {
                  setAddingTo(null);
                  setNewNoteContent('');
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Notes Tree */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[400px]">
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : filteredTree.length === 0 ? (
          <div className="text-center py-12">
            <Mind className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无笔记</p>
            <p className="text-sm text-gray-400 mt-1">
              点击右上角按钮添加你的第一个主题
            </p>
          </div>
        ) : (
          <div className="space-y-1">
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
              />
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
        <h3 className="font-medium text-gray-900 mb-2">使用技巧</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 点击节点前的箭头可展开/折叠子节点</li>
          <li>• 使用工具按钮添加子节点、编辑或删除</li>
          <li>• 支持导出为 Markdown 格式，方便在其他工具中使用</li>
        </ul>
      </div>
    </div>
  );
}
