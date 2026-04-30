# 系统管理页面

## 用户管理

路径：pages/system/systemUser/

| 文件 | 说明 |
|------|------|
| index.vue | 用户列表页（表格 + 搜索 + 分页） |
| form/UserForm.vue | 新增/编辑用户弹窗 |

### 功能

- 用户名/状态/时间筛选
- 新增/编辑/删除用户
- 重置密码
- 分配角色
- 用户状态切换

## 角色管理

路径：pages/system/systemRole/

| 文件 | 说明 |
|------|------|
| index.vue | 角色列表页 |
| form/RoleForm.vue | 新增/编辑角色弹窗 |

### 功能

- 角色 CRUD
- 分配权限（菜单 + 操作按钮）
- 角色状态管理

## 文件管理

路径：pages/system/systemFile/

| 文件 | 说明 |
|------|------|
| index.vue | 文件列表页 |
| components/ | 文件预览组件 |

### 功能

- 文件列表展示
- 文件在线预览
- 文件删除
