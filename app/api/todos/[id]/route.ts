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
    const { content, due_type, priority, status, due_date } = await request.json();

    const db = getDb();

    // 检查任务是否属于当前用户
    const existing = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(id, user.id);
    if (!existing) {
      return NextResponse.json({ error: '任务不存在' }, { status: 404 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    if (due_type !== undefined) {
      updates.push('due_type = ?');
      values.push(due_type);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      values.push(due_date);
    }

    if (updates.length > 0) {
      values.push(id, user.id);
      db.prepare(`UPDATE todos SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
    }

    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    return NextResponse.json({ todo });
  } catch (error) {
    console.error('Update todo error:', error);
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

    db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?').run(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete todo error:', error);
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
