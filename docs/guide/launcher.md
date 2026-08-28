# 启动器

FPSMaster 启动器是一个桌面程序。它负责下载游戏本体、安装加载器和客户端、管理账号与实例，然后直接启动游戏。不想手动折腾文件的话，从它开始最省事。

版本以 [GitHub Release 页](https://github.com/FPSMasterTeam/fpsmaster-launcher/releases)为准（写作本页时最新是 v0.3.16）。启动器采用 MIT 许可证，源码在 [fpsmaster-launcher](https://github.com/FPSMasterTeam/fpsmaster-launcher)。

## 支持的平台

| 平台 | 安装包 |
| --- | --- |
| Windows x64 | 安装程序 |
| Windows 7 x64 | 单独构建的安装程序 |
| Linux x64 | `.deb` 包 |
| macOS（Apple Silicon） | `.dmg` |

不提供 Intel Mac 安装包。Intel Mac 用户可以手动安装客户端，见[常见问题](/guide/faq#intel-mac-怎么办)。

## 下载与安装

1. 打开 [fpsmaster.top](https://fpsmaster.top)，下载对应平台的安装包。也可以从 [GitHub Release 页](https://github.com/FPSMasterTeam/fpsmaster-launcher/releases)下载。
2. 按平台安装：
   - Windows：运行安装程序，按提示完成。
   - Linux：在终端执行 `sudo dpkg -i 文件名.deb`，或用系统的软件安装器打开。
   - macOS：打开 `.dmg`，把应用拖进「应用程序」文件夹。
3. 启动它。

## 登录 FPSMaster 账号

启动器需要登录 FPSMaster 账号才能使用。未登录时打开启动器，会直接进入登录页，没有游客模式。

1. 输入用户名或邮箱，再输入密码，点登录。
2. 没有账号的话，点登录页的注册链接，在官网完成注册。
3. 可以勾选记住密码和自动登录，之后打开就不用重复输入。

安装、启动和预设同步都需要登录。部分预设可能尚未对所有账号开放，实例页会给出提示。

## 登录游戏账号

启动游戏还需要一个 Minecraft 游玩档案。支持两种：

- **正版账号**：微软验证。进大多数正版服务器需要它。登录时会打开浏览器完成微软授权。
- **离线账号**：输入一个用户名即可。只能进允许离线登录的服务器。

添加方法：进入账号中心，添加账号，选正版或离线，按提示完成。

## 启动 FPSMaster 客户端

启动器自带三个预设实例：

- **FPSMaster Edge (1.8.9)**：Forge 1.8.9 加 Edge 客户端。
- **FPSMaster Nova**：Fabric 加 Nova 客户端，启动前可以选游戏版本。
- **FPSMaster Extreme (1.8.9)**：实验性的原生客户端，不基于 Java 版加载器。它不完整，不适合当日常客户端，介绍见[实验项目](/about/experiments)。

选中 Edge 或 Nova 预设，点启动。首次启动会下载游戏文件、加载器和客户端本体，耗时取决于网络。之后再启动就快了。

## 创建自己的实例

除了预设，也可以建普通实例：

1. 进入安装页。
2. 选 Minecraft 版本。
3. 选加载器：原版、Forge 或 Fabric。
4. 需要 OptiFine 就勾上（可选项）。
5. 开始安装，等待完成。

每个实例的版本、模组和设置相互独立。在实例页可以改名、调整启动参数等设置。

## 内容库

侧边栏的「内容」页（内容库）用来给实例装内容，不用自己下文件再拖目录。

- 支持的类型：模组、资源包、光影、世界。
- 搜索来源：Modrinth 和 CurseForge。

用法：选中一个实例，打开内容页，选类型，搜索，点安装。内容会装进这个实例自己的目录，不影响其他实例。

## 服务器

服务器页用来浏览 FPSMaster 合作服务器，按分组筛选，点开查看介绍。在详情里点快速启动，会用当前选中的实例启动游戏并直接连进该服务器。

## 更新

启动器检测到新版本时会提示更新，按提示操作即可。

## 出问题了？

先看[常见问题](/guide/faq)。没找到答案，去 [fpsmaster-launcher 的 Issue 页](https://github.com/FPSMasterTeam/fpsmaster-launcher/issues)反馈，写清楚系统、启动器版本和复现步骤。
