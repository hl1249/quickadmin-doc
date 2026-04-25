---
layout: home

hero:
  name: Quick Admin
  text: 全栈快速开发框架
  tagline: 基于 NestJS + MongoDB + Vue 3，一套代码搞定后台管理全流程
  image:
    src: /logo.png
    alt: Quick Admin
  actions:
    - theme: brand
      text: 后端指南
      link: /backend/guide/start
    - theme: alt
      text: 管理后台
      link: /admin/guide/start
    - theme: alt
      text: 客户端框架
      link: /client/guide/start

features:
  - icon: ⚙️
    title: 后端（NestJS）
    details: NestJS + MongoDB + JWT 鉴权 + DbService 封装 · 提供 admin/client 双模块路由 · 缓存（Redis/内存） · 文件存储（OSS/本地） · WebSocket · 统一异常/响应
    link: /backend/guide/start
  - icon: 🖥️
    title: Admin 后台（Vue 3）
    details: Element Plus + Pinia + Vue Router · 完整的权限菜单体系 · 内置代码生成器 · 拖拽模板设计 · WebSocket 面板
    link: /admin/guide/start
  - icon: 📱
    title: Client 客户端（uni-app）
    details: uni-app 多端适配（H5 + 小程序） · 预置主题皮肤 · 首页/我的等通用页面 · 对接后端 client 模块接口
    link: /client/guide/start
---