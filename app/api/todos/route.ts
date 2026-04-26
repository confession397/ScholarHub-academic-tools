import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const db = getDb();
    let query = 'SELECT * FROM todos WHERE user_id = ?';
    const params: any[] = [user.id];

    if (type) {
      query += ' AND due_type = ?';
      params.push(type);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const todos = db.prepare(query).all(...params);
    return NextResponse.json({ todos });
  } catch (error) {
    console.error('Get todos error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { content, due_type, priority, due_date } = await request.json();

    if (!content) {
      return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
    }

    const db = getDb();
    const id = uuidv4();

    db.prepare(`
      INSERT INTO todos (id, user_id, content, due_type, priority, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, user.id, content, due_type || 'today', priority || 'medium', due_date || null);

    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    return NextResponse.json({ todo });
  } catch (error) {
    console.error('Create todo error:', error);
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
