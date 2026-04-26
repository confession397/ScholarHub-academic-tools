import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { id } = await params;
    const { content, parent_id, order_index } = await request.json();

    const db = getDb();

    const existing = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?').get(id, user.id);
    if (!existing) {
      return NextResponse.json({ error: '笔记不存在' }, { status: 404 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    if (parent_id !== undefined) {
      updates.push('parent_id = ?');
      values.push(parent_id);
    }
    if (order_index !== undefined) {
      updates.push('order_index = ?');
      values.push(order_index);
    }

    if (updates.length > 0) {
      values.push(id);
      db.prepare(`UPDATE notes SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
    return NextResponse.json({ note });
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    // 递归删除子节点
    const deleteRecursive = (noteId: string) => {
      const children = db.prepare('SELECT id FROM notes WHERE parent_id = ?').all(noteId) as { id: string }[];
      children.forEach(child => deleteRecursive(child.id));
      db.prepare('DELETE FROM notes WHERE id = ?').run(noteId);
    };

    deleteRecursive(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
