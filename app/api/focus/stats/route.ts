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

    // 今天的专注时长
    const today = new Date().toISOString().split('T')[0];
    const todayStats = db.prepare(`
      SELECT COALESCE(SUM(duration), 0) as total
      FROM focus_sessions
      WHERE user_id = ? AND date(started_at) = ? AND completed = 1
    `).get(user.id, today) as { total: number };

    // 本周的专注时长
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekStats = db.prepare(`
      SELECT COALESCE(SUM(duration), 0) as total
      FROM focus_sessions
      WHERE user_id = ? AND date(started_at) >= ? AND completed = 1
    `).get(user.id, weekStartStr) as { total: number };

    // 今天的专注次数
    const todayCount = db.prepare(`
      SELECT COUNT(*) as count
      FROM focus_sessions
      WHERE user_id = ? AND date(started_at) = ? AND completed = 1
    `).get(user.id, today) as { count: number };

    // 本周的每日统计
    const dailyStats = db.prepare(`
      SELECT date(started_at) as date, SUM(duration) as total
      FROM focus_sessions
      WHERE user_id = ? AND date(started_at) >= ? AND completed = 1
      GROUP BY date(started_at)
      ORDER BY date ASC
    `).all(user.id, weekStartStr);

    return NextResponse.json({
      todaySeconds: todayStats.total,
      weekSeconds: weekStats.total,
      todayMinutes: Math.round(todayStats.total / 60),
      weekMinutes: Math.round(weekStats.total / 60),
      todayCount: todayCount.count,
      dailyStats,
    });
  } catch (error) {
    console.error('Get focus stats error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}
