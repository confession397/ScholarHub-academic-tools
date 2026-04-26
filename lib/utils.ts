import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  return `${minutes}分钟`;
}

export function parseNaturalLanguageDate(input: string): { type: 'today' | 'week' | 'longterm'; date?: string } {
  const lower = input.toLowerCase();

  // 明天
  if (lower.includes('明天')) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { type: 'today', date: tomorrow.toISOString() };
  }

  // 今天
  if (lower.includes('今天') || lower.includes('今日')) {
    return { type: 'today' };
  }

  // 明天开始的一周
  if (lower.includes('这周') || lower.includes('本周') || lower.includes('这星期')) {
    return { type: 'week' };
  }

  // 长期
  if (lower.includes('长期') || lower.includes('以后') || lower.includes('未来')) {
    return { type: 'longterm' };
  }

  // 默认今天
  return { type: 'today' };
}

export function parsePriority(input: string): 'high' | 'medium' | 'low' {
  const lower = input.toLowerCase();

  if (lower.includes('紧急') || lower.includes('很重要') || lower.includes('高优先级')) {
    return 'high';
  }

  if (lower.includes('低优先级') || lower.includes('不急') || lower.includes('有空再')) {
    return 'low';
  }

  return 'medium';
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
