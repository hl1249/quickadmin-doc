# 管理后台（Vue 3）

## 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 | Composition API + script setup |
| TypeScript | 全量类型支持 |
| Vite | 构建工具 |
| Element Plus | UI 组件库 |
| Pinia | 状态管理 |
| Vue Router | 路由管理 |
| Tailwind CSS | 样式框架 |
| Axios | HTTP 请求 |
| Socket.IO Client | WebSocket 客户端 |
| ECharts / WangEditor / ACE | 可视化/富文本/代码编辑器 |

## 目录结构

```text
template/admin/
├── src/
│   ├── main.ts               # 应用入口
│   ├── App.vue               # 根组件
│   ├── api/                  # API 接口层
│   ├── assets/               # 静态资源
│   ├── components/           # 全局组件
│   ├── config/               # 配置文件
│   ├── layout/               # 布局组件
│   ├── pages/                # 页面
│   │   ├── login/            # 登录页
│   │   ├── home/             # 首页看板
│   │   ├── system/           # 系统管理页面
│   │   │   ├── systemUser/   # 用户管理
│   │   │   ├── systemRole/   # 角色管理
│   │   │   └── systemFile/   # 文件管理
│   │   ├── template/         # 模板页面
│   │   ├── databaseDesign/   # 数据库设计
│   │   └── error/            # 错误页
│   ├── router/               # 路由配置
│   ├── store/                # Pinia 状态管理
│   ├── style/                # 全局样式
│   ├── composables/          # 组合式函数
│   └── utils/                # 工具函数
├── public/                   # 公共资源
├── scripts/                  # 构建脚本
├── vite.config.ts            # Vite 配置
└── package.json
```

## 启动

```bash
# 进入 admin 目录
cd template/admin

# 安装依赖
pnpm install

# 开发模式
npm run dev

# 生产构建
npm run build
```
