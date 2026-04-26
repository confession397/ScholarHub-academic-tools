import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const db = getDb();

    // 获取今天的总时间
    const today = new Date().toISOString().split('T')[0];
    const todayStats = db.prepare(`
      SELECT COALESCE(SUM(duration), 0) as total
      FROM time_entries
      WHERE user_id = ? AND date(start_time) = ?
    `).get(user.id, today) as { total: number };

    // 获取本周的总时间
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekStats = db.prepare(`
      SELECT COALESCE(SUM(duration), 0) as total
      FROM time_entries
      WHERE user_id = ? AND date(start_time) >= ?
    `).get(user.id, weekStartStr) as { total: number };

    // 获取项目分布
    const projectStats = db.prepare(`
      SELECT p.name, p.color, COALESCE(SUM(te.duration), 0) as total
      FROM projects p
      LEFT JOIN time_entries te ON p.id = te.project_id
      WHERE p.user_id = ?
      GROUP BY p.id
      ORDER BY total DESC
    `).all(user.id);

    return NextResponse.json({
      todayMinutes: Math.round(todayStats.total / 60),
      weekMinutes: Math.round(weekStats.total / 60),
      projectStats,
    });
  } catch (error) {
    console.error('Get time stats error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}
