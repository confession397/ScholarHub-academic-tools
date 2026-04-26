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
    const items = db.prepare(`
      SELECT * FROM library
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(user.id);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Get library error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { url, title, content, excerpt, tags } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL不能为空' }, { status: 400 });
    }

    const db = getDb();
    const id = uuidv4();

    db.prepare(`
      INSERT INTO library (id, user_id, url, title, content, excerpt, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, user.id, url, title || '', content || '', excerpt || '', tags || '');

    const item = db.prepare('SELECT * FROM library WHERE id = ?').get(id);
    return NextResponse.json({ item });
  } catch (error) {
    console.error('Create library item error:', error);
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
