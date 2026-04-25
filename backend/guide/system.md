# 系统管理模块

系统管理模块是后台的核心业务模块，位于 `src/app/admin/system/`。

## 用户管理 (systemUser)

### 控制器

```typescript
@UseGuards(AuthGuard, PermissionGuard)
@Controller('api/admin/system/systemUser')
export class SystemUserController {}
```

### 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 用户列表（分页） |
| POST | /add | 新增用户 |
| POST | /update | 修改用户 |
| POST | /delete | 删除用户 |
| GET | /detail | 用户详情 |
| POST | /resetPassword | 重置密码 |

### 权限码

- `systemUser:select` - 查询
- `systemUser:add` - 新增
- `systemUser:update` - 修改
- `systemUser:delete` - 删除

## 角色管理 (systemRole)

### 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 角色列表 |
| POST | /add | 新增角色 |
| POST | /update | 修改角色 |
| POST | /delete | 删除角色 |
| GET | /detail | 角色详情 |
| POST | /setPermission | 设置角色权限 |

### 权限码

- `systemRole:select` - 查询
- `systemRole:add` - 新增
- `systemRole:update` - 修改
- `systemRole:delete` - 删除

## 权限管理 (systemPermission)

### 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 权限列表（树形） |
| POST | /add | 新增权限 |
| POST | /update | 修改权限 |
| POST | /delete | 删除权限 |

## 菜单管理 (systemMenu)

### 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 菜单列表（树形） |
| POST | /add | 新增菜单 |
| POST | /update | 修改菜单 |
| POST | /delete | 删除菜单 |

## 操作日志 (systemLog)

### 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 日志列表 |
| POST | /clear | 清空日志 |

## 文件管理 (systemFile)

### 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 文件列表 |
| POST | /delete | 删除文件 |

## 支付配置 (systemPayConfig)

### 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /list | 支付配置列表 |
| POST | /add | 新增配置 |
| POST | /update | 修改配置 |

## 应用 ID 管理 (sysAppid)

用于管理客户端（小程序等）的应用标识和密钥。

## WebSocket 连接池 (sysSocketPool)

管理实时 WebSocket 连接，支持：

- 连接状态监控
- 在线用户统计
- 消息推送
