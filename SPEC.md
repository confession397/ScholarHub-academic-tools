# ScholarHub - 学术工具集

## 1. 项目概述

**项目名称**: ScholarHub  
**项目类型**: 全栈Web应用 (Next.js + TypeScript + SQLite)  
**核心功能**: 为学术研究者和学生提供6大核心工具的集成平台  
**目标用户**: 学生、研究人员、学术写作者、知识管理者

## 2. 功能模块

### 2.1 TodoList (任务清单)
- **任务输入**: 支持自然语言识别时间和优先级
- **时间分类**: 今天必须做、这周必须做、长期目标
- **优先级**: 高/中/低三级
- **任务状态**: 待办/进行中/已完成
- **数据持久化**: 每个用户独立的任务列表

### 2.2 Workflowy (头脑风暴 + 结构化笔记)
- **大纲式编辑**: 无限层级缩进
- **脑图视图**: 可视化展示思维结构
- **节点操作**: 添加、编辑、删除、移动、重排序
- **搜索功能**: 快速定位笔记内容
- **导出功能**: 支持导出为Markdown

### 2.3 Toggl Track (时间追踪)
- **项目追踪**: 创建和管理项目
- **时间块**: 以时间块方式记录工作
- **任务关联**: 将时间与TodoList任务关联
- **统计报表**: 日/周/月时间分布图
- **复盘功能**: 查看时间花费明细

### 2.4 Forest (番茄钟/专注)
- **番茄工作法**: 25分钟专注 + 5分钟休息
- **专注统计**: 今日/本周专注时长
- **虚拟森林**: 可视化展示专注成果
- **自定义时长**: 支持自定义专注和休息时长

### 2.5 Print Friendly (网页保存)
- **URL抓取**: 输入URL获取干净的文章内容
- **内容清洗**: 去除广告和无关元素
- **收藏管理**: 保存到个人资料库
- **标签系统**: 为收藏添加标签分类
- **阅读列表**: 方便日后查阅

### 2.6 用户系统
- **注册登录**: 邮箱注册、本地登录
- **个人资料**: 头像上传、昵称、个人简介
- **数据隔离**: 每个用户数据独立

## 3. UI/UX 设计规范

### 3.1 视觉风格
- **设计语言**: Academic / 学术期刊风格
- **整体感觉**: 干净、专业、专注内容
- **参考风格**: Notion + 学术论文排版

### 3.2 色彩系统
```
Primary:      #2D4A6F (深蓝色 - 学术感)
Secondary:    #5B8C5A (森林绿 - 专注)
Accent:       #C9A227 (金色 - 强调)
Background:   #FAFAFA (浅灰白)
Surface:      #FFFFFF (纯白卡片)
Text Primary: #1A1A1A (近黑)
Text Secondary: #6B7280 (灰色)
Border:       #E5E7EB (浅灰边框)
```

### 3.3 字体系统
- **标题**: 'Playfair Display', Georgia, serif
- **正文**: 'Source Sans Pro', -apple-system, sans-serif
- **代码/等宽**: 'JetBrains Mono', monospace

### 3.4 间距系统
- 基础单位: 4px
- 间距层级: 4, 8, 12, 16, 24, 32, 48, 64px
- 卡片圆角: 8px
- 按钮圆角: 6px

### 3.5 动效设计
- 过渡时长: 200ms ease-out
- 悬停效果: 轻微上浮 + 阴影增强
- 页面切换: 淡入淡出

## 4. 技术架构

### 4.1 技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + 自定义CSS变量
- **数据库**: SQLite (better-sqlite3)
- **认证**: NextAuth.js (凭证登录)
- **状态管理**: React Context + Hooks
- **图标**: Lucide React

### 4.2 项目结构
```
/app
  /api              # API路由
  /(auth)           # 认证页面
    /login
    /register
  /(dashboard)      # 主应用
    /layout.tsx     # 侧边栏布局
    /page.tsx       # 仪表盘首页
    /todos          # TodoList
    /brainstorm     # Workflowy
    /time-tracker   # Toggl
    /focus          # Forest
    /library        # Print Friendly
    /profile        # 个人资料
/components
  /ui               # 通用UI组件
  /layout           # 布局组件
  /features         # 功能模块组件
/lib
  /db               # 数据库操作
  /auth             # 认证工具
  /utils            # 工具函数
```

### 4.3 API设计
```
POST   /api/auth/register     # 注册
POST   /api/auth/login        # 登录
GET    /api/user/profile      # 获取用户资料
PUT    /api/user/profile      # 更新用户资料

GET    /api/todos             # 获取任务列表
POST   /api/todos             # 创建任务
PUT    /api/todos/:id         # 更新任务
DELETE /api/todos/:id         # 删除任务

GET    /api/notes             # 获取笔记
POST   /api/notes             # 创建笔记
PUT    /api/notes/:id         # 更新笔记
DELETE /api/notes/:id         # 删除笔记

GET    /api/time-entries      # 获取时间记录
POST   /api/time-entries      # 创建时间记录
PUT    /api/time-entries/:id  # 更新时间记录
DELETE /api/time-entries/:id  # 删除时间记录

GET    /api/projects          # 获取项目列表
POST   /api/projects          # 创建项目

GET    /api/library            # 获取收藏列表
POST   /api/library            # 添加收藏
DELETE /api/library/:id        # 删除收藏
```

### 4.4 数据模型
```sql
-- 用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  avatar TEXT,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 任务表
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  due_type TEXT CHECK(due_type IN ('today', 'week', 'longterm')),
  priority TEXT CHECK(priority IN ('high', 'medium', 'low')),
  status TEXT CHECK(status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  due_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 笔记表 (Workflowy)
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  parent_id TEXT,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES notes(id)
);

-- 项目表
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 时间记录表
CREATE TABLE time_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT,
  todo_id TEXT,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  duration INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (todo_id) REFERENCES todos(id)
);

-- 收藏库表 (Print Friendly)
CREATE TABLE library (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 专注记录表 (Forest)
CREATE TABLE focus_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  duration INTEGER NOT NULL,
  started_at DATETIME NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 5. 页面布局

### 5.1 整体布局
- **侧边栏**: 固定左侧，宽度240px，包含导航和用户信息
- **主内容区**: 右侧自适应，padding 32px
- **顶部栏**: 页面标题 + 操作按钮

### 5.2 响应式策略
- **桌面**: 完整侧边栏 + 内容
- **平板**: 可折叠侧边栏
- **手机**: 底部导航 + 全屏内容

## 6. 开源部署

### 6.1 GitHub仓库
- 仓库名: scholarhub
- MIT开源协议
- 完整README文档

### 6.2 部署方式
- Vercel (推荐) 或 Netlify
- 支持一键部署

## 7. 开发阶段

### Phase 1: 基础框架 (已完成)
- [x] 项目初始化
- [x] 数据库配置
- [x] 基础布局组件
- [x] 样式系统

### Phase 2: 用户系统
- [x] 注册/登录页面
- [x] 个人资料管理
- [x] 头像上传

### Phase 3: 核心功能
- [ ] TodoList完整功能
- [ ] Workflowy脑图笔记
- [ ] Toggl时间追踪
- [ ] Forest番茄钟
- [ ] Print Friendly网页保存

### Phase 4: 完善优化
- [ ] 数据统计图表
- [ ] 响应式优化
- [ ] 性能优化

### Phase 5: 开源发布
- [ ] GitHub仓库创建
- [ ] README编写
- [ ] 部署配置
