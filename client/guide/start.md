# 客户端框架（uni-app）

## 技术栈

| 技术 | 说明 |
|------|------|
| uni-app | 多端统一开发框架 |
| Vue 3 | Composition API |
| uni-ui | uni-app 内置组件库 |
| SCSS | 样式预处理 |
| Pinia | 状态管理 |
| 微信小程序 | 主要发布平台 |

## 目录结构

`
template/client/
├── src/
│   ├── main.ts               # 应用入口
│   ├── pages/                # 页面
│   │   └── index/            # 首页
│   ├── api/                  # 接口层
│   ├── store/                # 状态管理
│   ├── utils/                # 工具函数
│   ├── static/               # 静态资源
│   └── style/                # 全局样式
├── env/                      # 环境配置
├── dist/                     # 构建产物
└── package.json
`

## 启动

`ash
# 进入 client 目录
cd template/client

# 安装依赖
pnpm install

# H5 预览
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# 生产构建 H5
npm run build:h5

# 小程序发布
npm run build:mp-weixin
`

## 多端支持

| 目标平台 | 命令 |
|----------|------|
| H5 网页 | dev:h5 / uild:h5 |
| 微信小程序 | dev:mp-weixin / uild:mp-weixin |
| 支付宝小程序 | dev:mp-alipay / uild:mp-alipay |
| 字节小程序 | dev:mp-toutiao / uild:mp-toutiao |
| App | dev:app / uild:app |
