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
    const { end_time, duration } = await request.json();

    const db = getDb();

    db.prepare(`
      UPDATE time_entries
      SET end_time = ?, duration = ?
      WHERE id = ? AND user_id = ?
    `).run(end_time, duration, id, user.id);

    const entry = db.prepare('SELECT * FROM time_entries WHERE id = ?').get(id);
    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Update time entry error:', error);
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

    db.prepare('DELETE FROM time_entries WHERE id = ? AND user_id = ?').run(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete time entry error:', error);
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
