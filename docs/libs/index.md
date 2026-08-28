# 开源库

FPSMaster 将可复用能力拆成三个独立库。它们不能作为 Minecraft 客户端直接安装。

| 库 | 运行环境 | 主要入口 | 当前消费方式 | 许可证 |
| --- | --- | --- | --- | --- |
| [Prism](/libs/prism) | Java 8 | `UiHost`、`UiFrame`、`Chrome`、`Shared*` | 从源码发布到本地 Maven，坐标 `top.fpsmaster:prism:0.2.0` | MIT |
| [Cadence](/libs/cadence) | Java 8 JVM | `MusicService`、`LyricParser` | JitPack `com.github.FPSMasterTeam:Cadence:v0.1.1` | MIT |
| [mcef-nova](/libs/mcef-nova) | Java 17、LWJGL 宿主 | `MCEFHost`、`MCEF`、`MCEFRenderer` | GitHub Packages `com.github.FPSMasterTeam:mcef-nova:1.0.1` | LGPL-2.1 |

## 如何选择

需要共享 2D 界面和交互组件时使用 Prism。宿主负责画布、字体、输入和平台渲染。

需要搜索音乐、取得播放直链、解析歌词或处理二维码登录时使用 Cadence。Cadence 不含播放器和界面。

需要在 Minecraft 宿主中嵌入 CEF 浏览器时使用 mcef-nova。它只把浏览器帧交给 OpenGL 纹理，最终绘制由宿主完成。

## 版本与发布

三个库的发布渠道不同：

- Prism 当前没有公开 tag 或 Release。README 中旧的 JitPack 示例不能当作已发布制品。
- Cadence 的 `v0.1.1` tag 可由 JitPack 构建。
- mcef-nova 的制品经 GitHub Packages 分发，读取时需要鉴权。Nova 当前消费 `1.0.1`。

复制示例前确认版本号和仓库根目录的 `LICENSE`。本地快照、未打 tag 的版本号和源码中的下一版本配置都不代表已发布。
