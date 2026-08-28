# 实验项目

## Extreme

Extreme 是功能尚不完整的 Rust 客户端重写实验。仓库用于验证客户端循环、世界状态、渲染和扩展系统的实现方式。

GitHub 上已有 [`v1.0.0` 实验构建](https://github.com/FPSMasterTeam/FPSMaster-Extreme/releases/tag/v1.0.0)，包含 Windows x86_64、Linux x86_64 和 macOS arm64 三个平台。这些构建不代表稳定或完整产品；项目不承诺存档、网络与扩展 API 的兼容性，也不承诺安装、更新或故障排查支持。日常游玩请使用 [Edge](/guide/edge) 或 [Nova](/guide/nova)。

启动器中会显示 Extreme 入口，它对应的仍是本页所述实验项目，不应视为正式产品介绍。

源码位于 [fpsmaster-extreme](https://github.com/FPSMasterTeam/fpsmaster-extreme)，采用 MIT 许可证。

## 仓库结构

| crate | 用途 |
| --- | --- |
| `fpsmaster_app` | 桌面窗口与客户端主循环 |
| `fpsmaster_core` | 世界、区块、方块、实体和玩家状态 |
| `fpsmaster_protocol` | 网络协议实验层 |
| `fpsmaster_render` | 基于 winit/wgpu 的渲染层 |
| `fpsmaster_ext` | 扩展加载与宿主实现 |
| `fpsmaster_ext_api` | 原生扩展的公开 ABI |

这些模块会继续调整。不要把当前网络和物理行为当作已完成兼容实现。

## 运行演示

工作区声明的最低 Rust 版本是 `1.82`。安装兼容的 Rust 工具链后，在仓库根目录运行：

```bash
cargo run -p fpsmaster_app
```

没有 Minecraft 资源时，程序使用调试纹理。需要本地 1.8.9 资源时运行：

```bash
python3 scripts/setup_minecraft_1_8_9_assets.py
cargo run -p fpsmaster_app
```

脚本将客户端资源和声音写入 `local_assets/`。该目录已被 Git 忽略。不要提交脚本下载的 Mojang 文件。

提交前执行：

```bash
cargo check
cargo test -p fpsmaster_core -p fpsmaster_protocol -p fpsmaster_render
```

## 扩展 SDK

Extreme 提供 JavaScript 与原生 Rust 两层扩展。当前宿主对 JavaScript 和原生扩展声明的兼容版本都是 API `0.3`：

```toml
api = "^0.3"
```

宿主与 workspace 以 `crates/fpsmaster_ext_api` 为源码依据。该 crate 在 `Cargo.toml` 中的包版本是 `1.0.0`，其中 `API_VERSION` 常量和宿主的原生 API 版本是 `0.3.0`；包版本与 manifest 的 API 兼容版本不是同一个编号。

::: warning 原生 SDK 快照尚未对齐
`sdk/native/fpsmaster_ext_api` 仍是 `0.2` ABI：即使它的包版本写成 `0.3.0`，`API_VERSION` 常量和 `HostApi` 布局仍旧停留在 `0.2`。`sdk/native/template` 与 `sdk/native/example` 当前都通过相对路径引用这份快照，不能据此构建面向当前宿主的原生扩展。请改用 `crates/fpsmaster_ext_api`，或直接参考 workspace 中的 `crates/fpsmaster_native_example`。
:::

### JavaScript 扩展

JavaScript 扩展适合读取状态、绘制 HUD、处理输入和保存扩展配置。每个扩展放在独立目录：

```text
mods/coords/
├── mod.toml
└── main.js
```

`mod.toml`：

```toml
id = "example.coords"
version = "1.0.0"
tier = "js"
api = "^0.3"
entry = "main.js"
capabilities = ["hud", "read_player"]
```

`main.js`：

```js
mc.drawHud(() => {
  const player = mc.player;
  const text =
    `XYZ ${player.x.toFixed(1)} / ${player.y.toFixed(1)} / ${player.z.toFixed(1)}`;
  hud.text(2, 2, text, { color: 0xffffffff, scale: 1 });
});

mc.on("load", () => mc.log("coords loaded"));
```

从 `sdk/js/mc.d.ts` 取得编辑器类型提示。示例位于 `sdk/js/examples/`。修改后可在实验客户端中重新加载扩展。

manifest 的 `capabilities` 是权限意图声明，不是安全沙箱。只运行来源可信的扩展。

### 原生扩展

原生扩展是 Rust `cdylib`，通过 `fpsmaster_ext_api` 与宿主通信。它适合需要原生状态、独立线程或渲染接口的实验。

当前 workspace 示例直接依赖与宿主一致的 API crate：

```bash
cargo build -p fpsmaster_native_example --release
```

如果要继续使用 `sdk/native/template` 的结构，先把模板依赖改到正确的 crate：

```toml
fpsmaster_ext_api = { path = "../../../crates/fpsmaster_ext_api" }
```

将生成的动态库与 `mod.toml` 放在同一个 `mods/<id>/` 目录。`entry` 必须写实际文件名。macOS、Linux 和 Windows 需要分别构建对应二进制。

原生扩展与客户端同进程运行，可以访问宿主进程资源，也可能让客户端崩溃。API 或 ABI 更新后重新编译；布局或版本不兼容时，加载器会拒绝扩展。

## 实验边界

- 发布的实验构建不代表完整功能或长期支持。
- 不保证现有世界、物理、协议和渲染结果与 Minecraft 1.8.9 一致。
- SDK 示例只说明公开扩展接口，不能作为兼容性承诺。
- 不提交 Mojang 资源、账号凭证或第三方 SDK 文件。
- 影响公开扩展接口时，同时更新 `sdk/js/mc.d.ts`、manifest 示例和原生 API 版本。
