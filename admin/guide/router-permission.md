# 路由与权限

## 路由架构

路由分为两部分：

1. **基础路由** — 登录页、错误页等公开页面
2. **动态路由** — 根据用户权限从后端动态生成

## 权限流程

```
用户登录 → 后端返回 token + 菜单/权限列表
    ↓
前端根据权限动态生成路由
    ↓
渲染侧边栏菜单
    ↓
页面内按钮级权限控制
```

## 路由守卫

```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  const token = useTokenStore();
  if (!token && to.path !== '/login') {
    next('/login');
  } else {
    next();
  }
});
```

## 按钮权限

```vue
<template>
  <el-button v-if="hasPermission('systemUser:add')">
    新增用户
  </el-button>
</template>
```
