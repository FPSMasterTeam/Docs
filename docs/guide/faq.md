# 常见问题

## Edge 和 Nova 怎么选

按你玩的 Minecraft 版本选：

- 1.8.9 用 [Edge](/guide/edge)，基于 Forge。
- 1.19.2、1.20.1、1.21.1、1.21.8、1.21.11 用 [Nova](/guide/nova)，基于 Fabric。

两个客户端相互独立，可以都装，互不影响。

## 从哪里下载

- 官网：[fpsmaster.top](https://fpsmaster.top)
- Modrinth：[modrinth.com/mod/fpsmaster](https://modrinth.com/mod/fpsmaster)
- CurseForge（Edge）：[curseforge.com/minecraft/mc-mods/fpsmaster](https://www.curseforge.com/minecraft/mc-mods/fpsmaster)
- 各仓库的 GitHub Release 页

不想手动装就用[启动器](/guide/launcher)。不要从来路不明的站点下载重新打包的版本。

## 用启动器和手动装模组有什么区别

结果一样，过程不同。

启动器自动下载游戏本体、装加载器和客户端，管理账号和多个实例，点一下就能玩。使用前需要登录 FPSMaster 账号。适合不想折腾文件的玩家。

手动安装是自己装 Forge 或 Fabric，再把客户端 jar 放进 `mods` 文件夹。适合已经在用其他启动器、或想把客户端加进现有模组配置的玩家。

## 需要装 Fabric API 或其他前置吗

不需要。Nova 只依赖 Fabric Loader。Edge 只依赖 Forge 1.8.9。

## beta 版本是什么意思

Edge 和 Nova 目前都是 beta 版本：功能还在打磨，可能有影响体验的问题，更新节奏也比较快。遇到问题去对应仓库的 GitHub Issue 反馈，附上版本号和复现步骤。重要的配置建议先导出备份。

## Edge 和 Nova 的许可证为什么不一样

Edge 采用 GPL-3.0，Nova 和启动器采用 MIT，这是各仓库自己的选择。正常游玩没有区别。如果你要基于源码做二次开发或分发，先确认对应仓库的条款，细节见[许可证](/about/licenses)。

## Linux 能用吗

分两块看：

- 启动器提供 Linux x64 的 `.deb` 包，可以正常安装使用。
- Nova 在 Linux 上未经测试，能不能正常运行不保证。
- Edge 是普通的 Forge 1.8.9 模组，跟随原版 1.8.9 在 Linux 上的表现。

## Intel 核显能用 Nova 吗

能启动，但体验没有保证。Nova 的客户端界面在 Nvidia 和 AMD 显卡上支持 GPU 加速；检测到 Intel 核显时会自动关闭加速、改用软件渲染，游戏照常运行，但界面流畅度可能下降，官方也没有针对核显做完整测试。追求稳定体验建议用独立显卡，或玩 Edge（1.8.9）。

## Intel Mac 怎么办

启动器不提供 Intel Mac 安装包。可以用其他启动器手动安装：装好 Forge 或 Fabric，把客户端 jar 放进 `mods` 文件夹即可，步骤见 [Edge](/guide/edge#手动安装) 和 [Nova](/guide/nova#手动安装)。

## 用客户端会被服务器封号吗

不能给出保证。每个服务器对第三方客户端的态度不同，反作弊的判定规则也不公开。上某个服务器之前，先看它的规则，拿不准就问服务器管理。

## 游戏出问题了怎么反馈

按出问题的组件去对应仓库提 Issue：

- 启动器：[fpsmaster-launcher](https://github.com/FPSMasterTeam/fpsmaster-launcher/issues)
- Edge：[fpsmaster-edge](https://github.com/FPSMasterTeam/fpsmaster-edge/issues)
- Nova：[fpsmaster-nova](https://github.com/FPSMasterTeam/fpsmaster-nova/issues)

写清楚版本号、系统、复现步骤，最好附日志和截图。
