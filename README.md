# FPSMaster Docs

FPSMaster 公开文档站，基于 [VitePress](https://vitepress.dev) 构建。

## 本地预览

需要 Node.js 20 及以上。

```bash
npm install
npm run docs:dev      # 启动开发服务器
npm run docs:build    # 构建静态站点
npm run docs:preview  # 本地预览构建产物
```

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages，默认地址：

https://fpsmasterteam.github.io/Docs/

首次启用需要仓库 owner 在 **Settings → Pages → Source** 中选择 **GitHub Actions**。

## 许可证

本仓库以 Apache-2.0 许可证发布，见 [LICENSE](LICENSE)。
