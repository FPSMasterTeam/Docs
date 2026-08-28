# 构建 Nova

Nova 用 Stonecutter 在同一份源码树上覆盖多个 Minecraft 版本，每个版本是一个 Gradle 子项目。

启动某个版本的开发客户端：

```bash
./gradlew :1.21.11:runClient
```

把 `1.21.11` 换成其他受支持的版本号（例如 `:1.20.1:runClient`）即可切换目标版本。构建产物：

```bash
./gradlew build
```

Nova 依赖 mcef-nova 的构建制品，拉取方式见 [mcef-nova](/libs/mcef-nova)。

本页内容还在写。
