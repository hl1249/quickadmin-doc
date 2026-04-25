# 鉴权体系

## JWT 认证

采用 **JWT（JSON Web Token）** 实现无状态认证。

### 登录流程

```typescript
// 登录接口：POST /api/admin/auth/login
// 请求体
{
  "username": "admin",
  "password": "123456"
}

// 成功响应
{
  "code": 200,
  "data": {
    "token": "xxx.yyy.zzz",        // 访问令牌
    "refreshToken": "xxx.yyy.zzz", // 刷新令牌
    "userInfo": { ... }
  }
}
```

### Token 使用

客户端将 Token 放入请求头：

```
Authorization: Bearer xxx.yyy.zzz
```

### Token 刷新

```typescript
// POST /api/admin/auth/refresh
{
  "refreshToken": "xxx.yyy.zzz"
}
```

## 权限守卫

### AuthGuard（登录守卫）

验证 JWT Token 是否有效，注入用户信息到请求上下文。

```typescript
@UseGuards(AuthGuard)
@Controller('api/admin')
export class SystemUserController {}
```

### PermissionGuard（权限守卫）

校验当前用户是否拥有接口所需的操作权限码。

```typescript
@UseGuards(AuthGuard, PermissionGuard)
@Controller('api/admin/system/systemUser')
export class SystemUserController {}
```

权限码格式：`模块:操作`（如 `systemUser:select`）
