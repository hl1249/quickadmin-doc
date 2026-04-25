import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Quick Admin',
  description: 'Quick Admin 全栈快速开发框架文档',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Quick Admin',
    nav: [
      { text: '首页', link: '/' },
      { text: '后端', link: '/backend/guide/start' },
      { text: '管理后台', link: '/admin/guide/start' },
      { text: '客户端', link: '/client/guide/start' },
    ],
    sidebar: {
      '/backend/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/backend/guide/start' },
            { text: '目录结构', link: '/backend/guide/structure' },
            { text: '鉴权体系', link: '/backend/guide/auth' },
            { text: 'DbService 指南', link: '/backend/guide/db-service' },
            { text: '系统管理模块', link: '/backend/guide/system' },
            { text: '缓存模块', link: '/backend/guide/cache' },
            { text: 'WebSocket', link: '/backend/guide/websocket' },
            { text: '对象存储', link: '/backend/guide/oss' },
          ],
        },
        {
          text: 'API 参考',
          items: [
            { text: 'API 概览', link: '/backend/api/overview' },
          ],
        },
        {
          text: '部署运维',
          items: [
            { text: '部署指南', link: '/backend/advanced/deploy' },
          ],
        },
      ],
      '/admin/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/admin/guide/start' },
            { text: '布局', link: '/admin/guide/layout' },
            { text: '路由与权限', link: '/admin/guide/router-permission' },
          ],
        },
        {
          text: '功能页面',
          items: [
            { text: '系统管理页面', link: '/admin/guide/system-pages' },
            { text: '模板模块', link: '/admin/guide/template-modules' },
          ],
        },
      ],
      '/client/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/client/guide/start' },
            { text: '页面说明', link: '/client/guide/pages' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/quickadmin' },
    ],
    footer: {
      message: 'MIT 协议发布',
      copyright: 'Copyright © 2026 Quick Admin',
    },
  },
  lastUpdated: true,
  cleanUrls: true,
})
