# ScholarHub - 学术工具集

ScholarHub 是一个为学术研究者和学生打造的全功能工具集，提供了任务管理、头脑风暴、时间追踪、专注计时和网页收藏等功能。

![ScholarHub](https://img.shields.io/badge/ScholarHub-Academic%20Tools-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 功能特性

### 1. TodoList - 任务清单
- 支持自然语言识别时间和优先级
- 任务分类：今天必须做、这周必须做、长期目标
- 高/中/低三级优先级
- 任务状态管理（待办、进行中、已完成）

### 2. Workflowy - 头脑风暴
- 无限层级的大纲式笔记
- 树形结构整理思路
- 支持展开/折叠
- 导出为 Markdown 格式

### 3. Toggl Track - 时间追踪
- 项目管理
- 时间块记录
- 关联任务
- 统计报表（日/周/月）
- 时间复盘

### 4. Forest - 专注森林
- 番茄工作法（25分钟专注 + 5分钟休息）
- 虚拟森林可视化
- 专注统计
- 自定义时长

### 5. Library - 收藏库
- 保存网页链接
- 内容摘要和标签
- 搜索和筛选
- 构建个人知识库

### 6. 用户系统
- 邮箱注册登录
- 个人资料管理
- 头像上传
- 数据隔离

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: SQLite (better-sqlite3)
- **认证**: 自定义会话管理
- **图标**: Lucide React

## 开始使用

### 前置要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/scholarhub.git
cd scholarhub

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
scholarhub/
├── app/
│   ├── (auth)/              # 认证页面
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # 主应用
│   │   ├── dashboard/       # 仪表盘
│   │   ├── todos/          # 任务清单
│   │   ├── brainstorm/      # 头脑风暴
│   │   ├── time-tracker/    # 时间追踪
│   │   ├── focus/          # 专注森林
│   │   ├── library/         # 收藏库
│   │   └── profile/         # 个人资料
│   └── api/                  # API 路由
├── lib/
│   ├── auth.ts              # 认证逻辑
│   ├── db/                   # 数据库
│   └── utils.ts             # 工具函数
└── public/                  # 静态资源
```

## 数据库

应用使用 SQLite 数据库，数据库文件 `scholarhub.db` 会在首次运行时自动创建。

### 数据表

- `users` - 用户表
- `todos` - 任务表
- `notes` - 笔记表（头脑风暴）
- `projects` - 项目表（时间追踪）
- `time_entries` - 时间记录表
- `library` - 收藏库表
- `focus_sessions` - 专注记录表

## 设计风格

ScholarHub 采用学术风格的 UI 设计：

- **配色方案**: 深蓝色主色调，搭配森林绿和金色点缀
- **字体**: Playfair Display（标题）+ Source Sans Pro（正文）
- **布局**: 简洁的侧边栏导航 + 主内容区

## 部署

### Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/scholarhub)

### Netlify

1. Fork 本仓库
2. 在 Netlify 中导入项目
3. 构建命令设置为 `npm run build`
4. 输出目录设置为 `.next`

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Google Fonts](https://fonts.google.com/)

---

Made with ❤️ for researchers and students
