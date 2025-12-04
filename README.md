# Daily Focus

一个使用 Next.js + Tailwind CSS + MySQL 构建的「每日计划 / 明日计划 / 历史回顾」专注任务管理应用。

## 本地开发快速开始

1. 安装依赖：

```bash
npm install
```

2. 配置环境变量（在项目根目录创建 `.env.local`）：

```bash
DATABASE_URL="mysql://user:password@localhost:3306/daily_focus"
```

3. 初始化数据库结构（使用提供的 `schema.sql` 在本地 MySQL 执行）。

4. 启动开发服务器：

```bash
npm run dev
```

默认访问 http://localhost:3000 查看应用。
