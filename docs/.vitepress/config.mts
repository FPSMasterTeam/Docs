import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'FPSMaster 文档',
  description: 'FPSMaster 客户端、启动器与开源库的说明',
  base: '/Docs/',
  cleanUrls: true,
  lastUpdated: true,

  head: [['link', { rel: 'icon', href: '/Docs/favicon.svg', type: 'image/svg+xml' }]],

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: '使用指南', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: '开发者', link: '/dev/', activeMatch: '/dev/' },
      { text: '开源库', link: '/libs/', activeMatch: '/libs/' },
      { text: '许可证', link: '/about/licenses', activeMatch: '/about/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '使用指南',
          items: [
            { text: '开始使用', link: '/guide/getting-started' },
            { text: '启动器', link: '/guide/launcher' },
            { text: 'Edge', link: '/guide/edge' },
            { text: 'Nova', link: '/guide/nova' },
            { text: '常见问题', link: '/guide/faq' },
          ],
        },
      ],
      '/dev/': [
        {
          text: '开发者',
          items: [
            { text: '总览', link: '/dev/' },
            { text: '参与贡献', link: '/dev/contributing' },
            { text: '构建 Edge', link: '/dev/edge' },
            { text: '构建 Nova', link: '/dev/nova' },
          ],
        },
      ],
      '/libs/': [
        {
          text: '开源库',
          items: [
            { text: '总览', link: '/libs/' },
            { text: 'Prism', link: '/libs/prism' },
            { text: 'Cadence', link: '/libs/cadence' },
            { text: 'mcef-nova', link: '/libs/mcef-nova' },
          ],
        },
      ],
      '/about/': [
        {
          text: '关于',
          items: [
            { text: '许可证', link: '/about/licenses' },
            { text: '实验项目', link: '/about/experiments' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/FPSMasterTeam' }],

    editLink: {
      pattern: 'https://github.com/FPSMasterTeam/Docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '返回',
            noResultsText: '没有找到相关结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最后更新',
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',

    notFound: {
      title: '页面不存在',
      quote: '这个页面可能已被移动或删除。',
      linkText: '回到首页',
      linkLabel: '回到首页',
    },
  },
})
