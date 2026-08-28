# Nova

FPSMaster Nova 是基于 Fabric 的多版本客户端。一个项目覆盖多个 Minecraft 版本，功能思路和 Edge 一致。当前公开版本 v1.0.2-beta.1，处于 beta 阶段。

Nova 采用 MIT 许可证，源码在 [fpsmaster-nova](https://github.com/FPSMasterTeam/fpsmaster-nova)。想参与开发，见[构建 Nova](/dev/nova)。

## 支持的 Minecraft 版本

| 版本 | 状态 |
| --- | --- |
| 1.19.2 | 支持 |
| 1.20.1 | 支持 |
| 1.21.1 | 支持 |
| 1.21.8 | 支持 |
| 1.21.11 | 支持 |
| 26.2 | 可运行，部分渲染能力还在适配 |

每个游戏版本有单独的 jar，下载时认准文件名里的游戏版本号。

## 运行要求与已知限制

- Windows 和 macOS 已测试。Linux 未测试，能不能跑不保证。
- 需要 Nvidia 或 AMD 显卡。不支持 Intel 核显。
- 不支持 Android。
- Java 版本要求跟随对应的原版 Minecraft。

## 下载

- [官网](https://fpsmaster.top)
- [Modrinth](https://modrinth.com/mod/fpsmaster)（和 Edge 同一个项目页，按游戏版本选 Nova 的构建）
- [GitHub Releases](https://github.com/FPSMasterTeam/fpsmaster-nova/releases)

也可以用 [FPSMaster 启动器](/guide/launcher)，它自带 Nova 预设实例，启动前选游戏版本即可。

## 手动安装

1. 安装 Fabric Loader，选你要玩的 Minecraft 版本。从 Fabric 官网下载安装器运行即可。
2. 下载对应游戏版本的 Nova jar。
3. 把 jar 放进 `.minecraft/mods` 文件夹。
4. 用 Fabric 配置启动游戏。

Nova 只依赖 Fabric Loader，不需要 Fabric API。

## 基本操作

和 Edge 相同：

| 操作 | 默认按键 |
| --- | --- |
| 打开客户端设置界面 | 右 Shift |
| 按住缩放视野 | 左 Ctrl |
| 聊天栏命令前缀 | `.` |

HUD 组件可以自由摆放，在 HUD 编辑器里拖动位置、调整大小。

## 功能

Nova 的模块同样分四类。名称和用途与 Edge 大体对应，按你在游戏里看到的名称列出：

**优化**：性能优化（实体渲染优化、粒子限制、限制区块加载等一组开关）、平滑缩放、无受伤抖动、无攻击延迟、更好的鱼竿。

**视觉**：动画（旧版 PvP 动作和手部动画）、方块高亮、清洁视角、自定义迷雾、自定义准星、伤害指示器、火焰修改、自由视角、保持亮度、隐藏攻击指示器、击中颜色、碰撞箱、物品物理、最小摇晃、运动模糊、更多粒子。

**实用**：自动 GG、快捷发言、自定义 FOV、等级标签、名称保护、粒子修改、音量修改、强制疾跑、TNT 计时器、时间修改、原始输入、录像、潜行切换、客户端设置。

**界面**：FPS 显示、CPS 显示、按键显示、延迟显示、坐标显示、方向显示、时钟显示、服务器地址显示、游戏时长、连击显示、攻击距离显示、目标显示、护甲显示、药水显示、饱和度显示、背包显示、物品数量、玩家显示、小地图、功能列表、性能监视器、计分板、聊天框、聊天头像、Tab 列表、方块指示器、歌词 HUD、自定义标题、更好的界面。

各模块的具体作用可以参考 [Edge 的模块说明](/guide/edge#模块)，两边同名模块的用途一致。

## 命令

在聊天栏输入，以 `.` 开头：

- `.help`：列出全部命令和用法。
- `.toggle <模块>`：开关模块。
- `.set <模块> <选项> <值>`：修改模块选项。
- `.bind <模块> <按键|none>`：绑定快捷键。
- `.config`：管理配置方案。
- `.telemetry status`：查看匿名数据上报的当前状态。
- `.telemetry on` / `.telemetry off`：开启或关闭匿名数据上报。

## 账号与饰品

主菜单支持添加微软账号或离线账号。登录 FPSMaster 账号后可以预览和穿戴披风、龙翼背饰等饰品，不登录不影响正常游玩。

## 匿名使用数据

Nova 的匿名数据上报默认关闭。用 `.telemetry on` 开启，`.telemetry off` 关闭，`.telemetry status` 查看当前状态。上报内容是匿名使用数据，不包含明文账号信息。

## 与 Via 系列共存

Nova 可以和 ViaFabric 或 ViaFabricPlus 一起安装，用来连接其他版本的服务器。Nova 不自带它们，需要的话自己装进 mods 文件夹。

## 出问题了？

去 [fpsmaster-nova 的 Issue 页](https://github.com/FPSMasterTeam/fpsmaster-nova/issues)反馈。写清楚游戏版本、Nova 版本、系统和显卡型号，最好带上日志。
