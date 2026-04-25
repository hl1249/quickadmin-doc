# API 概览

后端提供两套 API 体系：

| 分组 | 前缀 | 鉴权 | 用途 |
|------|------|------|------|
| admin | `/api/admin/...` | JWT + 权限守卫 | 后台管理系统接口 |
| client | `/api/client/...` | 可选（应用 ID 鉴权） | 客户端用户接口 |

## 统一响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

状态码：

| code | 说明 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录 / Token 失效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## admin 接口前缀

所有后台接口以 `/api/admin/` 开头：

```
/api/admin/auth/...
/api/admin/system/systemUser/...
/api/admin/system/systemRole/...
/api/admin/system/systemMenu/...
/api/admin/system/systemPermission/...
/api/admin/system/systemLog/...
/api/admin/system/systemFile/...
/api/admin/system/systemPayConfig/...
/api/admin/system/sysAppid/...
/api/admin/system/sysSocketPool/...
/api/admin/dev/databaseDesign/...
/api/admin/template/...
```

## client 接口前缀

所有客户端接口以 `/api/client/` 开头：

```
/api/client/appid/...
/api/client/user/...
```
