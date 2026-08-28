# Prism

Prism 是一个 immediate-mode UI 脚手架，零 Minecraft / LWJGL / 加载器依赖，只要求 Java 8。Edge 和 Nova 共用它：同一套界面代码，宿主各自实现 `UiHost` / `Canvas` 抽象即可渲染。

它没有 retained 组件树，每帧重建 UI 并即时绘制；色板、圆角、间距由 `Theme` / `Metrics` 集中管理。

当前源码版本是 0.2.0，尚无公开的 Release tag，需要使用时从源码构建。

Prism 采用 MIT 许可证，源码在 [fpsmaster-prism](https://github.com/FPSMasterTeam/fpsmaster-prism)。

本页内容还在写。
