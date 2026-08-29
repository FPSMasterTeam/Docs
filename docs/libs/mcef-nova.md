# mcef-nova

mcef-nova 是 Nova 使用的嵌入式浏览器组件，基于 CEF（Chromium Embedded Framework），为 Nova 的浏览器界面提供渲染能力。

源码公开，采用 LGPL-2.1 许可证；构建制品通过 GitHub Packages 分发。Nova 当前消费的版本是 1.0.1。

拉取 GitHub Packages 上的制品需要一个有 `read:packages` 权限的 GitHub token，在 `~/.gradle/gradle.properties` 里配置两个属性：

```properties
gpr.user=你的 GitHub 用户名
gpr.key=你的 personal access token
```

不要把 token 提交进任何仓库。

源码在 [mcef-nova](https://github.com/FPSMasterTeam/mcef-nova)。

本页内容还在写。
