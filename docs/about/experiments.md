# 实验项目

## Extreme

Extreme 是 Rust 客户端重写实验。仓库用于验证客户端循环、世界状态、渲染和扩展系统的实现方式。

它仍是实验脚手架，不是玩家产品。没有玩家下载，也不承诺存档、网络或扩展 API 的长期兼容。日常游玩请使用 [Edge](/guide/edge) 或 [Nova](/guide/nova)。

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

连接服务器的路径仍属于实验范围。本页不记录协议细节，也不提供自动发包或修改对战行为的操作步骤。

## 扩展 SDK

Extreme 提供 JavaScript 与原生 Rust 两层扩展。当前源码、manifest 和示例使用 API `0.3`：

```toml
api = "^0.3"
```

开发时以 `sdk/js/examples/`、`sdk/native/` 和 `fpsmaster_ext_api` 的 `0.3.0` 源码为准。

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

从仓库内的模板开始：

```bash
cd sdk/native/template
cargo build --release
```

也可以构建完整示例：

```bash
cd sdk/native/example
cargo build --release
```

将生成的动态库与 `mod.toml` 放在同一个 `mods/<id>/` 目录。`entry` 必须写实际文件名。macOS、Linux 和 Windows 需要分别构建对应二进制。

原生扩展与客户端同进程运行，可以访问宿主进程资源，也可能让客户端崩溃。API 或 ABI 更新后重新编译；布局或版本不兼容时，加载器会拒绝扩展。

## 实验边界

- 不提供面向玩家的安装、更新或故障排查承诺。
- 不保证现有世界、物理、协议和渲染结果与 Minecraft 1.8.9 一致。
- SDK 示例只说明公开接口，不说明内部网络协议。
- 不提交 Mojang 资源、账号凭证或第三方 SDK 文件。
- 影响公开扩展接口时，同时更新 `sdk/js/mc.d.ts`、manifest 示例和原生 API 版本。
