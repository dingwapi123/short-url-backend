# Short URL 后端

一个使用 Express + Sequelize 的后端服务，提供短链创建与解析。

## 快速开始

```sh
pnpm install
pnpm dev
```

默认端口：`3000`

Swagger 文档：`http://localhost:3000/v1/api-docs`

## 环境变量

在项目根目录（后端）创建 `.env`（已提供 `.env.example`），常用变量：

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres-short-url
DB_USER=postgres
DB_PASSWORD=你的密码

PROJECT_URL=http://localhost:5173
SHORT_URL_LENGTH=6
PORT=3000
```

- `PROJECT_URL`：生成短链时的域名前缀。例如设为前端域名 `http://localhost:5173`，则后端返回短链为 `http://localhost:5173/{code}`。
- `SHORT_URL_LENGTH`：短码长度。
- `PORT`：后端服务端口（可选，默认 3000）。

## API

- 创建短链：`POST /v1/urlRecord`
  - 请求体：`{ originalUrl: string, urlCode?: string }`
  - 响应：`{ message: string, data?: { id, originalUrl, shortUrl, urlCode, createdAt, updatedAt } }`
- 查询原始链接：`GET /v1/{urlCode}`
  - 响应：`{ message: string, data?: string }`（当前返回 JSON）

> 如需“点击短链即 302 跳转”，可将控制器改为 `res.redirect(originalUrl)`，并把 `PROJECT_URL` 设置为后端 `/v1` 路径。

## 目录结构与关键代码

- `src/server.js`：读取环境端口并启动服务
- `src/app.js`：注册中间件与路由（`/v1`）
- `src/controllers/urlRecordController.js`：创建短链（含输入清洗与校验）
- `src/controllers/urlRedirectController.js`：按短码查询原始链接
- `src/utils/urlHelper.js`：生成短链（基于 `PROJECT_URL` 与随机短码）
- `src/utils/dbHelper.js`：数据库连接（PostgreSQL + Sequelize）
- `src/utils/loggerHelper.js`：Pino 日志（写入 `./src/logs`）

代码位置示例：

- 创建短链入口：`src/controllers/urlRecordController.js:26`、`58`
- 查询原始链接入口：`src/controllers/urlRedirectController.js:3`、`23`
- 路由挂载：`src/app.js:24-25`
- 短链生成：`src/utils/urlHelper.js:9`、`29`

## 日志与忽略

- 日志目录：`./src/logs`，已在后端 `.gitignore` 中忽略（使用 `src/logs/`）
- 若日志已被跟踪，请取消跟踪：

```sh
git rm -r --cached short-url-backend/src/logs
git commit -m "chore(backend): ignore src/logs and stop tracking logs"
```

## 其他特性

- 限流：`express-rate-limit`（每分钟 15 次，`src/utils/rateLimiter.js`）
- CORS：默认开启（`src/app.js`）
- Swagger：`/v1/api-docs`（`src/swagger.json`）

## 开发命令

```sh
pnpm dev                 # 开发模式（dotenvx + nodemon）
pnpm dev:database-connect# 仅测试数据库连接
pnpm seed                # 运行数据脚本（若有）
```

## 部署建议

- 使用生产级数据库与正确的环境变量
- 若前端域名即对外短链域名，`PROJECT_URL` 设置为该前端地址
- 若希望后端直接跳转，`PROJECT_URL` 设置为 `http(s)://后端域名/v1` 并将查询接口改为 302 重定向
