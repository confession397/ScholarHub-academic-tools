import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const db = getDb();
    const sessions = db.prepare(`
      SELECT * FROM focus_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 100
    `).all(user.id);
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Get focus sessions error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { duration } = await request.json();

    const db = getDb();
    const id = uuidv4();

    db.prepare(`
      INSERT INTO focus_sessions (id, user_id, duration, started_at, completed)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, user.id, duration || 1500, new Date().toISOString(), 1);

    const session = db.prepare('SELECT * FROM focus_sessions WHERE id = ?').get(id);
    return NextResponse.json({ session });
  } catch (error) {
    console.error('Create focus session error:', error);
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
