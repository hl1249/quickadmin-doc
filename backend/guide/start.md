# 快速开始

## 环境要求

- **Node.js**: >= 20.x
- **pnpm**: >= 8.x
- **MongoDB**: >= 6.0（推荐 8.0）
- **Redis**: 可选（启用缓存时需安装）

## 启动服务端

```bash
# 进入项目目录
cd quick-admin1.1

# 安装依赖
pnpm install

# 复制环境变量模板
cp .env.example .env

# 开发模式（热重载）
npm run start:dev

# 生产构建
npm run build:prod

# 生产模式
npm run start:prod
```

## 初始化数据库

1. 下载并安装 [MongoDB 8.0](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.0.3-signed.msi)，或到 [MongoDB 官网](https://www.mongodb.com/) 开通云 MongoDB 服务。
2. 服务端启动后，浏览器访问 `http://localhost:3000/setup/index.html`，按页面提示完成数据库初始化。

## 环境变量

参考 `.env.example` 配置：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| DB_URL | MongoDB 连接地址 | mongodb://localhost |
| DB_PORT | MongoDB 端口 | 27017 |
| DB_NAME | 数据库名 | quickAdmin |
| JWT_SECRET | JWT 密钥 |（必填）|
| JWT_EXPIRES_IN | Token 有效期 | 7d |
| PASSWORD_SECRET | 密码加密密钥 |（必填）|
| CACHE_TYPE | 缓存类型 | memory（可选 redis）|
| CACHE_TTL | 缓存有效期(秒) | 604800 |
| REDIS_HOST | Redis 地址 | 127.0.0.1 |
| REDIS_PORT | Redis 端口 | 6379 |
| CORS_ORIGIN | 允许的跨域源 | 不设则允许所有 |

## 验证启动

服务默认运行在 `http://localhost:3000`，访问 `/api/admin/auth/login` 即可测试接口。
