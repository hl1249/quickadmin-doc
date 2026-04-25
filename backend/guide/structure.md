# 目录结构

## 后端模块详解

### src/app/  — 业务模块

| 子模块 | 说明 |
|--------|------|
| admin/ | 后台管理接口（带鉴权） |
| client/ | 客户端接口（无需登录或用户登录） |
| callback/ | 外部回调（如微信支付回调） |

### src/app/admin/  — 后台管理

| 模块 | 说明 |
|------|------|
| auth/ | 登录/退出/刷新 Token |
| system/ | 系统管理 |
| system/systemUser/ | 用户管理 |
| system/systemRole/ | 角色管理 |
| system/systemPermission/ | 权限管理 |
| system/systemMenu/ | 菜单管理 |
| system/systemLog/ | 操作日志 |
| system/systemFile/ | 文件管理 |
| system/systemPayConfig/ | 支付配置 |
| system/sysAppid/ | 应用 ID 管理 |
| system/sysSocketPool/ | WebSocket 连接池 |
| dev/ | 开发工具 |
| dev/databaseDesign/ | 数据库设计器 |
| template/ | 模板管理 |
| test/ | 测试接口 |

### src/app/client/  — 客户端接口

| 模块 | 说明 |
|------|------|
| appid/ | 客户端应用标识 |
| user/ | 用户接口 |
