# 参与贡献

## 开始前

1. 在[开发者总览](/dev/)中选择仓库。
2. 搜索已有 Issue 和 Pull Request，避免重复实现。
3. 大功能、公共 API 调整和跨仓库改动先开 Issue。说明目标、边界和兼容性影响。
4. 小范围修复可以直接提交 Pull Request，但要写出复现方式。

不要在 Edge 仓库实现现代 Minecraft 多版本框架。不要把 Nova 的玩法逻辑建立在 Fabric API 事件上。跨客户端通用能力应先判断是否属于 Prism、Cadence 或 mcef-nova。

## 分支与提交

Fork 目标仓库，从默认分支创建短分支：

```bash
git switch -c fix/short-description
```

一个 Pull Request 处理一个问题。不要混入格式化整个仓库、无关重命名或依赖升级。

提交信息使用简短的祈使句。可以使用 `feat:`、`fix:`、`docs:`、`refactor:` 等前缀：

```text
fix: handle missing player during HUD render
```

提交前检查 `git diff`。不要提交账号、令牌、Cookie、本地配置、Minecraft 资源、构建目录或 IDE 缓存。

## 代码要求

- 跟随目标目录的现有命名和格式。
- 新增公共接口时写清参数、返回值和线程要求。
- 可恢复错误要记录上下文并回退。不要新增空 `catch`。
- 文件、网络、反射及 Minecraft 玩家/世界对象要处理空值和失败路径。
- 改动用户可见行为时同步更新对应公开文档。
- 新依赖要说明用途、许可证和为何不能复用现有依赖。

Edge 使用 Java 8 目标字节码。Nova 的版本差异写在 Stonecutter 条件中，并在受影响的版本节点验证。Prism 和 Cadence 的公共接口不能引用 Minecraft 类型。

## 本地验证

在改动所属仓库执行对应命令。Windows 下可将 `./gradlew` 换成 `gradlew.bat`。

| 项目 | 最低验证 |
| --- | --- |
| Edge | `./gradlew test`，然后 `./gradlew build` |
| Nova | `./gradlew :1.21.11:compileJava`，再构建受影响版本 |
| 启动器 | 在 `tauri-app/` 执行 `npm run typecheck`、`npm run lint`、`npm run build` |
| Prism | `./gradlew test` |
| Cadence | `./gradlew build` |
| mcef-nova | `./gradlew build` |
| Extreme | `cargo check` 和相关 crate 的 `cargo test` |
| Docs | `npm ci` 和 `npm run docs:build` |

玩法、渲染、输入和原生库改动不能只靠编译。Pull Request 中写明实际运行的 Minecraft 版本、系统、显卡，以及手动检查的场景。无法完成某项验证时，直接说明原因和剩余风险。

## Pull Request 描述

描述中至少包含：

1. 问题和预期行为。
2. 实现范围，以及明确没有处理的内容。
3. 自动测试和手动验证命令。
4. 截图、日志或复现步骤。只附与改动相关的部分。
5. 兼容性、配置迁移和许可证影响。

评审意见应通过新提交处理，便于查看差异。重写历史前先确认不会覆盖其他人的提交。

## 许可证

各仓库许可证不同。完整列表见[许可证](/about/licenses)。提交代码前阅读目标仓库根目录的 `LICENSE`；引用第三方代码时同时保留其版权和许可声明。
