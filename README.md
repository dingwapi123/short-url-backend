# Short URL 后端

一个使用 TypeScript + Express + Drizzle ORM 构建的短链生成与解析服务。

## 技术栈

- **语言**: TypeScript
- **框架**: Express
- **数据库**: PostgreSQL
- **ORM**: Drizzle ORM
- **日志**: Pino
- **API 文档**: Swagger

## 快速开始

1. **安装依赖**

```bash
pnpm install
```

2. **配置环境变量**

复制 `.env.example` 为 `.env` 并填入数据库配置：

```env
# 短链接长度配置（默认6位）
SHORT_URL_LENGTH=6

# 本地开发环境前端地址
PROJECT_URL=http://localhost:5173
# 线上生产环境前端地址
# PROJECT_URL=https://your-frontend-domain.com

# 数据库连接字符串
# 格式: postgresql://user:password@host:port/database
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres-short-url
```

3. **数据库迁移**

```bash
pnpm db:generate # 生成迁移文件
pnpm db:migrate  # 应用迁移到数据库
```

4. **启动服务**

```bash
pnpm dev   # 开发模式
pnpm start # 生产模式
```

- 服务端口：`3000`
- Swagger 文档：`http://localhost:3000/v1/api-docs`

## API 接口

### 1. 短链管理 (`/v1/urlRecord`)

- **创建短链** (`POST /v1/urlRecord`)
  - Body: `{ "originalUrl": "https://example.com", "urlCode": "custom-code" }`
  - Response: `{ "message": "success", "data": { ... } }`

- **获取所有短链** (`GET /v1/urlRecord`)
  - Query: `page=1&pageSize=10`

- **更新短链** (`PUT /v1/urlRecord/:id`)
  - Body: `{ "title": "New Title", "urlCode": "new-code" }`

- **删除短链** (`DELETE /v1/urlRecord/:id`)

### 2. 短链跳转 (`/v1/:urlCode`)

- **获取原始链接** (`GET /v1/:urlCode`)
  - Response: `{ "message": "success", "data": "original_url" }`
  - *注：此接口返回原始链接，前端获取后进行跳转。*

## 项目结构

```
src/
├── controllers/     # 业务逻辑控制器
├── db/             # 数据库连接与 Schema 定义
├── routes/         # 路由定义
├── scripts/        # 工具脚本 (如 seed)
├── utils/          # 通用工具函数
├── app.ts          # Express 应用实例
└── server.ts       # 服务入口
drizzle/            # 数据库迁移文件
```

## 开发命令

```bash
pnpm dev          # 启动开发服务器 (tsx + watch)
pnpm build        # 编译 TypeScript
pnpm db:generate  # 生成 Drizzle 迁移文件
pnpm db:migrate   # 执行数据库迁移
pnpm seed         # 重置并填充初始数据
```

## 部署

本项目支持部署到任何 Node.js 兼容平台（如 Render, Railway, Vercel 等）。

1. 设置环境变量（参考 `.env.example`）。
2. 构建项目：`pnpm build`。
3. 启动服务：`pnpm start`。
4. **注意**：连接 Supabase 等云数据库时，代码会自动启用 SSL (`rejectUnauthorized: false`)。
