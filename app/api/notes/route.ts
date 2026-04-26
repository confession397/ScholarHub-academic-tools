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
    const notes = db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY order_index ASC').all(user.id);
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { content, parent_id } = await request.json();

    if (!content) {
      return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
    }

    const db = getDb();
    const id = uuidv4();

    // 获取最大排序索引
    const maxOrder = db.prepare(
      'SELECT MAX(order_index) as max FROM notes WHERE user_id = ? AND parent_id IS ?'
    ).get(user.id, parent_id || null) as { max: number } | undefined;
    const order_index = (maxOrder?.max || 0) + 1;

    db.prepare(`
      INSERT INTO notes (id, user_id, parent_id, content, order_index)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, user.id, parent_id || null, content, order_index);

    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
    return NextResponse.json({ note });
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
