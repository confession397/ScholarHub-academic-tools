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
    const projectId = searchParams.get('project_id');
    const limit = searchParams.get('limit') || '50';

    const db = getDb();
    let query = `
      SELECT te.*, p.name as project_name, p.color as project_color, t.content as todo_content
      FROM time_entries te
      LEFT JOIN projects p ON te.project_id = p.id
      LEFT JOIN todos t ON te.todo_id = t.id
      WHERE te.user_id = ?
    `;
    const params: any[] = [user.id];

    if (projectId) {
      query += ' AND te.project_id = ?';
      params.push(projectId);
    }

    query += ' ORDER BY te.start_time DESC LIMIT ?';
    params.push(parseInt(limit));

    const entries = db.prepare(query).all(...params);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Get time entries error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { project_id, todo_id, description, start_time, end_time, duration } = await request.json();

    const db = getDb();
    const id = uuidv4();

    db.prepare(`
      INSERT INTO time_entries (id, user_id, project_id, todo_id, description, start_time, end_time, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, user.id, project_id || null, todo_id || null, description || '', start_time, end_time || null, duration || 0);

    const entry = db.prepare('SELECT * FROM time_entries WHERE id = ?').get(id);
    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Create time entry error:', error);
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
