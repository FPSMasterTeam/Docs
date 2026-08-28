# Prism

Prism 是 Java 8 immediate-mode UI 脚手架。它不依赖 Minecraft、LWJGL、Fabric 或 Forge。

Edge 和 Nova 使用同一套 `Shared*` 界面。两个客户端分别实现 `UiHost` 与 `Canvas`，把绘制、输入和平台差异留在宿主。

源码位于 [fpsmaster-prism](https://github.com/FPSMasterTeam/fpsmaster-prism)，采用 MIT 许可证。

## 获取依赖

当前源码版本是 `0.2.0`，本地 Maven 坐标为：

```text
top.fpsmaster:prism:0.2.0
```

仓库目前没有公开 tag 或 Release。README 中的 `0.1.0` JitPack 示例不能视为已发布制品。需要接入时，从源码构建并发布到本地 Maven：

```bash
git clone https://github.com/FPSMasterTeam/fpsmaster-prism.git
cd fpsmaster-prism
./gradlew test
./gradlew publishToMavenLocal
```

消费方添加：

```kotlin
repositories {
    mavenLocal()
}

dependencies {
    implementation("top.fpsmaster:prism:0.2.0")
}
```

Prism 输出 Java 8 字节码。宿主仍需按自己的 Minecraft 版本选择运行 JDK。

## 组成

| 类型 | 职责 |
| --- | --- |
| `UiHost` | 提供 `Canvas`、输入、字体、逻辑尺寸、时钟、图片和可选模糊 |
| `Canvas` | 实现矩形、圆角、文字、图片、裁剪、透明度和变换 |
| `UiFrame` | 组合一次绘制与命中测试，维护裁剪栈 |
| `Chrome` | 提供按钮、卡片、面板、开关和滑块等无状态组件 |
| `Theme` / `Metrics` | 统一颜色、圆角、间距和控件尺寸 |
| `Shared*` | 实现跨客户端共享的页面或 HUD |
| `*Bridge` | 由宿主提供数据、导航和业务动作 |

Prism 没有 retained 组件树。宿主每帧创建 `UiFrame`，重新调用页面绘制方法。需要长期保留的状态放在页面对象或宿主，不要存入 `Canvas`。

## 实现宿主

第一步，实现 `Canvas`。所有坐标都使用 Prism 的逻辑单位：

```java
public final class MyCanvas implements Canvas {
    @Override
    public void fillRect(float x, float y, float w, float h, int argb) {
        // 转换为宿主渲染调用。
    }

    // 实现 Canvas 的其余方法。
}
```

第二步，实现 `UiHost`：

```java
public final class MyHost implements UiHost {
    private final MyCanvas canvas = new MyCanvas();
    private final FrameInput input = new FrameInput();

    @Override
    public Canvas canvas() {
        return canvas;
    }

    @Override
    public Input input() {
        return input;
    }

    @Override
    public FontHandle font(int size) {
        return fontCache.get(size);
    }

    @Override
    public float width() {
        return logicalWidth;
    }

    @Override
    public float height() {
        return logicalHeight;
    }

    @Override
    public long nowNanos() {
        return System.nanoTime();
    }

    @Override
    public boolean blurEnabled() {
        return false;
    }

    @Override
    public void blurBehind(float x, float y, float w, float h, float radius) {
    }

    @Override
    public ImageHandle image(String id) {
        return images.get(id);
    }
}
```

字体和图片句柄由宿主创建并缓存。`width()`、`height()`、输入坐标和 `Canvas` 坐标必须使用同一逻辑尺度。

## 驱动一帧

将平台输入转成 `FrameInput` 事件，再绘制页面：

```java
input.setMouse(mouseX, mouseY);
UiFrame ui = new UiFrame(host, Theme.DARK);

if (Chrome.button(
        ui, 12, 12, 80, 20,
        "保存", Chrome.ButtonStyle.PRIMARY
)) {
    save();
}

input.endFrame();
```

鼠标按下、松开、滚轮和键盘事件分别调用 `press`、`release`、`addWheel`、`setKeyDown` 或 `type`。`endFrame()` 在绘制结束后调用一次，清除本帧已消费事件。

涉及裁剪和点击的内容使用 `UiFrame.pushClip()` / `popClip()`。这样命中测试与实际可见区域一致。仅绘制、不参与命中时可以直接使用 `Canvas` 裁剪。

## 接入共享页面

共享页面通过 Bridge 与业务层解耦。以主菜单为例：

1. 实现 `MenuBridge`。
2. 从宿主返回本地化文本、版本和玩家显示名。
3. 将单人游戏、多人游戏、设置、退出等动作接到宿主导航。
4. 每帧调用 `SharedMainMenu.draw`。

```java
UiFrame ui = new UiFrame(host, Theme.DARK);
SharedMainMenu.draw(ui, menuBridge);
```

其他页面遵循同样结构：

| 页面 | 共享实现 | Bridge |
| --- | --- | --- |
| ClickGUI | `SharedClickGui` | `ClickGuiBridge` |
| 音乐 | `SharedMusic` | `MusicBridge` |
| 配置档案 | `SharedConfigProfiles` | `ConfigProfilesBridge` |
| 背景 | `SharedBackgrounds` | `BackgroundsBridge` |
| 外观 | `SharedCosmetics` | `CosmeticsBridge` |
| HUD 编辑器 | `SharedHudEditor` | `HudEditorBridge` |

新增共享页面时，在 Prism 中放布局、控件组合和与平台无关的状态。Minecraft 类、网络客户端和文件路径留在 Bridge 实现中。

## 测试

```bash
./gradlew test
```

仓库包含无窗口的 `HeadlessHost`、记录型 Canvas 和 Java2D 测试后端。新增控件时至少覆盖点击边界、裁剪、输入消费和主题差异。宿主渲染实现还需在真实客户端中检查缩放、文字基线与透明度。
