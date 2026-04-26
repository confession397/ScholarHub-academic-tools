import { NextResponse } from 'next/server';
import { getSession, updateUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { name, avatar, bio } = await request.json();

    const updated = await updateUser(user.id, { name, avatar, bio });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}
