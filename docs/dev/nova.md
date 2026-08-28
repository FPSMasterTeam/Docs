# Nova 开发

Nova 是 Fabric 客户端。Stonecutter 将一份 Kotlin/Java 源码编译为多个 Minecraft 版本子项目。

当前版本节点：

| Minecraft | Java 目标 | 状态 |
| --- | --- | --- |
| `1.19.2` | 17 | 支持 |
| `1.20.1` | 17 | 支持 |
| `1.21.1` | 21 | 支持 |
| `1.21.8` | 21 | 支持 |
| `1.21.11` | 21 | 推荐开发节点 |
| `26.2` | 25 | 部分渲染功能仍待适配 |

Windows 和 macOS 有实际运行记录。Linux 尚未测试。Intel 集成显卡和 Android 当前不受支持。

## 准备环境

常规开发使用 JDK 21。构建或运行 `26.2` 节点时使用 JDK 25，因为该版本的 Minecraft 类文件就是 Java 25 字节码。

克隆 [fpsmaster-nova](https://github.com/FPSMasterTeam/fpsmaster-nova)，然后从仓库根目录运行 Gradle Wrapper。仓库当前没有 `ui/` 目录，不需要启动单独的 npm 开发服务器。

Nova 依赖 Prism、Cadence 和 mcef-nova。mcef-nova 的 `1.0.1` 制品从 GitHub Packages 获取；鉴权配置见 [mcef-nova 文档](/libs/mcef-nova)。

## 常用命令

先在推荐节点工作：

```bash
./gradlew :1.21.11:runClient
./gradlew :1.21.11:compileJava
./gradlew :1.21.11:remapJar
./gradlew :1.21.11:build
```

| 任务 | 用途 |
| --- | --- |
| `runClient` | 启动指定版本的开发客户端 |
| `compileJava` | 快速检查 Java 与 Mixin 代码 |
| `remapJar` | 生成指定版本的 remap jar |
| `build` | 编译、测试并生成完整产物 |

将命令中的版本号替换为其他已声明节点即可：

```bash
./gradlew :1.20.1:build
./gradlew :26.2:compileJava
```

根任务会处理所有版本，耗时和依赖下载量都更高：

```bash
./gradlew build
```

开发阶段优先执行目标节点任务。提交前再构建所有受影响的版本。

## Stonecutter 条件

版本节点声明在 `settings.gradle.kts`。每个版本的 loader、映射与 Java 版本在 `build.gradle.kts` 的 `VersionSpec` 中配置。

共享源码使用 `//?` 条件处理 API 差异：

```kotlin
//? if >=1.21.11 {
val handle = minecraft.window.handle()
//?} else {
/*val handle = minecraft.window.window
*///?}
```

条件应贴合真实 API 边界。例如输入 API 与资源标识符变化使用 `>=1.21.11`，渲染管线变化使用对应的 `>=1.21.5` 边界。不要为了单个差异复制整个类。

各版本可以有独立的 Mixin 配置和 access widener。修改 Mixin 后检查目标类是否存在于对应的 `fpsmaster-<version>.mixins.json`，并至少运行该节点的 `compileJava` 与 `runClient`。

## 添加玩法模块

模块位于 `src/main/kotlin/top/fpsmaster/module/impl/`，按 `optimization`、`render`、`auxiliary`、`ui` 分类。

一个模块至少包含稳定的 identity 和分类：

```kotlin
class MyFeature : Module("my-feature", Category.AUXILIARY) {
    override fun onEnable() {
        // 只处理模块自身状态。
    }

    override fun onDisable() {
        // 清理模块自身状态。
    }
}
```

在 `ModuleManager.initialize()` 的 `addModule(...)` 中注册实例。用户可见名称和设置文本写入 `src/main/resources/assets/fpsmaster/lang/`。

模块可以使用 Nova 自己的模块、事件和值系统保存状态。但修改 Minecraft 行为时，使用 vanilla 客户端内部类和 Mixin 注入。不要把玩法实现接到 Fabric API 生命周期或事件回调上。

推荐结构：

1. 模块保存开关、配置与少量状态。
2. Mixin 在真实游戏调用点读取模块状态。
3. 版本差异使用 Stonecutter 条件或独立的版本 Mixin。
4. 将 Mixin 类名加入该版本实际使用的配置文件。

## ViaFabric 可选运行

开发客户端可以附带 ViaFabric 或 ViaFabricPlus：

```bash
./gradlew :1.21.11:runClient -PwithViaFabric
```

```bash
./gradlew :1.21.11:runClient -PwithViaFabricPlus
```

两个属性不能同时使用。构建脚本会直接报错，因为两套实现会互相冲突。

## 26.2 适配

`26.2` 使用未混淆游戏类和 JDK 25。它的延迟渲染接口与 `1.21.11` 不同。文本 HUD、基础界面和浏览器软件渲染已有适配，部分原生或 3D 渲染路径仍待补齐。

处理 `26.2` 时：

1. 用 JDK 25 运行 Gradle。
2. 先执行 `./gradlew :26.2:compileJava`。
3. 对照 `fpsmaster-26.2.mixins.json` 与 `fpsmaster-26.2.accesswidener`。
4. 启动 `:26.2:runClient`，检查 Mixin 命中、HUD、界面和浏览器渲染。
5. 不要假设在 `1.21.11` 可用的渲染调用能直接复用。

## 提交检查

- 推荐节点的 `compileJava`、`remapJar` 或 `build` 已通过。
- 所有受影响版本节点均已编译。
- Mixin 已加入正确的版本配置。
- 玩法行为通过 vanilla 内部类和 Mixin 实现。
- ViaFabric 与 ViaFabricPlus 没有同时启用。
- 渲染或输入改动已用 `runClient` 手动验证。
- Pull Request 中写明系统、显卡、JDK 和验证过的 Minecraft 版本。
