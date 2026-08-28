# 开发者

FPSMaster 的代码按产品和库拆在多个仓库。先确定改动属于哪一层，再准备对应工具链。

## 选择仓库

| 仓库 | 适合处理的内容 | 许可证 |
| --- | --- | --- |
| [fpsmaster-edge](https://github.com/FPSMasterTeam/fpsmaster-edge) | Minecraft 1.8.9 Forge 客户端、模块、HUD、Mixin | GPL-3.0 |
| [fpsmaster-nova](https://github.com/FPSMasterTeam/fpsmaster-nova) | Fabric 多版本客户端、Stonecutter 适配 | MIT |
| [fpsmaster-launcher](https://github.com/FPSMasterTeam/fpsmaster-launcher) | Tauri 桌面启动器、React 界面、Rust 启动逻辑 | MIT |
| [fpsmaster-prism](https://github.com/FPSMasterTeam/fpsmaster-prism) | Java 8 immediate-mode UI 脚手架 | MIT |
| [Cadence](https://github.com/FPSMasterTeam/Cadence) | 音乐搜索、直链、歌词和登录数据客户端 | MIT |
| [mcef-nova](https://github.com/FPSMasterTeam/mcef-nova) | 与 Minecraft 版本解耦的 CEF 组件 | LGPL-2.1 |
| [fpsmaster-extreme](https://github.com/FPSMasterTeam/fpsmaster-extreme) | Rust 客户端与扩展 SDK 实验 | MIT |
| [Docs](https://github.com/FPSMasterTeam/Docs) | 本文档站 | Apache-2.0 |

只改 Minecraft 1.8.9 时选 Edge。需要覆盖 `1.19.2` 到 `26.2` 的 Fabric 版本时选 Nova。通用界面、音乐数据或浏览器能力应优先改对应的独立库，再在客户端接入。

Extreme 是功能尚不完整的实验项目。GitHub 提供 `v1.0.0` 的 Windows、Linux 和 macOS 实验构建，但项目不承诺兼容性或支持；日常游玩请使用 Edge 或 Nova。启动器中的 Extreme 入口也指向这一实验项目，边界说明见[实验项目](/about/experiments)。

## 客户端开发入口

- [Edge 开发](/dev/edge)：准备 JDK 17/21 与 JDK 8，构建 Forge 1.8.9 客户端。
- [Nova 开发](/dev/nova)：用 Stonecutter 构建指定 Minecraft 版本。

两个客户端都使用 Gradle Wrapper。不要用系统里的全局 Gradle 代替仓库内的 `gradlew`。

## 启动器开发入口

启动器代码在 `tauri-app/`。先安装 Node.js、npm、Rust，以及 Tauri 2 对当前系统要求的构建依赖。

```bash
cd tauri-app
npm ci
npm run dev
```

上面的命令只启动 Vite 界面。调试桌面程序时运行：

```bash
npm run tauri -- dev
```

提交前至少执行：

```bash
npm run typecheck
npm run lint
npm run build
```

## 独立库

- [Prism](/libs/prism)：实现 `UiHost`、`Canvas` 和业务 Bridge。
- [Cadence](/libs/cadence)：通过 `MusicService` 读取音乐数据，不负责播放。
- [mcef-nova](/libs/mcef-nova)：通过 `MCEFHost` 接入宿主渲染线程，由宿主绘制浏览器纹理。

库的发布方式不同。复制依赖坐标前先读对应页面，不要从旧 README 推断已发布版本。

## 修改本文档

文档站要求 Node.js 20 或更高版本。

```bash
npm ci
npm run docs:dev
```

提交前构建一次静态站点：

```bash
npm run docs:build
```

通用提交和评审要求见[参与贡献](/dev/contributing)。许可证摘要见[许可证](/about/licenses)。
