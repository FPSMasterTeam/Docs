# Edge 开发

Edge 是 Minecraft Forge 1.8.9 客户端。仓库是单个 Gradle 项目，Java 代码位于 `src/main/java/top/fpsmaster/`。

当前开发版本是 `1.0.2-beta`。版本值同时出现在 `gradle.properties` 与 `FPSMaster.CLIENT_VERSION`，修改版本时要保持一致。

## 工具链

需要两套 JDK：

| 用途 | JDK |
| --- | --- |
| Gradle、IDE 导入、编译 | 17 或 21 |
| 运行 Minecraft 1.8.9 客户端 | 8 |

不要用 JDK 25 运行当前 Gradle/Loom 组合。

Apple Silicon 上运行客户端时，使用 x86_64 JDK 8，并通过 Rosetta 启动。Minecraft 1.8.9 使用的 LWJGL 2 原生库不能在 arm64 JDK 8 中直接加载。

## 导入 IntelliJ IDEA

1. 克隆 [fpsmaster-edge](https://github.com/FPSMasterTeam/fpsmaster-edge)。
2. 用 IntelliJ IDEA 打开仓库根目录并链接 `build.gradle.kts`。
3. 将 Gradle JVM 设为 JDK 17 或 21。
4. 在仓库根目录生成运行配置：

```bash
./gradlew genIntelliJRuns
```

5. 如果运行配置没有出现，将生成的 `.idea/runConfigurations` 复制到项目根目录的 `.idea/`，再重新打开项目。
6. 将 `Minecraft Client` 配置的运行时 JRE 改为 JDK 8。不要同时修改 Gradle JVM。

运行配置中的路径必须指向本机。若 `.gradle/loom-cache/launch.cfg` 或资源目录仍是其他机器的路径，改成绝对路径后再启动。

Windows 下将本页命令中的 `./gradlew` 换成 `gradlew.bat`。

## 构建与测试

```bash
./gradlew build
./gradlew remapJar
./gradlew shadowJar
./gradlew genIntelliJRuns
./gradlew test
```

| 任务 | 输出或用途 |
| --- | --- |
| `build` | 完整构建，包含 remap 产物 |
| `remapJar` | 生成可分发的 remap jar |
| `shadowJar` | 生成带 `all-dev` classifier 的 shaded 开发包 |
| `genIntelliJRuns` | 生成 IntelliJ Minecraft 运行配置 |
| `test` | 运行 JUnit 5 测试 |

只跑一个测试时使用：

```bash
./gradlew test --tests "com.example.MyFeatureTest"
```

构建通过后，还要在 Forge 1.8.9 客户端中验证玩法、HUD 或渲染改动。

## 添加模块

模块继承 `top.fpsmaster.features.manager.Module`。设置在构造函数中注册。事件方法使用项目自己的 `@Subscribe`：

```java
package top.fpsmaster.features.impl.utility;

import top.fpsmaster.event.Subscribe;
import top.fpsmaster.event.events.EventTick;
import top.fpsmaster.features.manager.Category;
import top.fpsmaster.features.manager.Module;
import top.fpsmaster.features.settings.impl.BooleanSetting;

public class MyFeature extends Module {
    public final BooleanSetting showMessage =
            new BooleanSetting("ShowMessage", true);

    public MyFeature() {
        super("MyFeature", Category.Utility);
        addSettings(showMessage);
    }

    @Subscribe
    public void onTick(EventTick event) {
        if (!showMessage.getValue()) {
            return;
        }
        // 在这里处理每 tick 的逻辑。
    }
}
```

然后在 `ModuleManager.init()` 中注册：

```java
modules.add(new MyFeature());
```

模块开启时会向 `EventDispatcher` 注册，关闭时会注销。不要再接一套外部事件总线。

模块名和设置名是稳定键。中英文文本写入：

```text
src/main/resources/assets/minecraft/client/lang/zh_cn.lang
src/main/resources/assets/minecraft/client/lang/en_us.lang
```

键名使用小写的 `模块名`、`模块名.desc` 和 `模块名.设置名`：

```properties
myfeature=示例功能
myfeature.desc=说明这个功能的用途
myfeature.showmessage=显示消息
```

## 添加 HUD

HUD 由两部分组成：

1. `InterfaceModule` 保存开关和设置。
2. `Component` 或 `TextComponent` 负责测量与绘制。

单行文本优先继承 `TextComponent`：

```java
public class MyDisplay extends InterfaceModule {
    public final ColorSetting textColor =
            new ColorSetting("TextColor", new Color(255, 255, 255, 255));

    public MyDisplay() {
        super("MyDisplay", Category.Interface);
        addSettings(textColor);
    }
}
```

```java
public class MyDisplayComponent extends TextComponent {
    public MyDisplayComponent() {
        super(MyDisplay.class);
        allowScale = true;
    }

    @Override
    protected String text() {
        return "Hello";
    }

    @Override
    protected int fontSize() {
        return 18;
    }

    @Override
    protected int textColor() {
        return ((MyDisplay) mod).textColor.getRGB();
    }
}
```

在 `ModuleManager.init()` 注册模块：

```java
modules.add(new MyDisplay());
```

在 `ComponentsManager.init()` 注册组件：

```java
addComponentSafely("MyDisplayComponent", MyDisplayComponent::new);
```

两边缺一不可。`InterfaceModule` 会根据 `Trait` 统一注册背景、圆角和字体设置；子类不要重复添加 `bg`、`rounded`、`betterFont` 等公共项。传给 HUD 文本的颜色必须包含 alpha，裸 `0xRRGGBB` 会被当作透明色。

## 添加 Mixin

Mixin 类放在 `top.fpsmaster.forge.mixin`：

```java
@Mixin(EntityRenderer.class)
public class MixinEntityRendererExample {
    @Inject(method = "renderWorldPass", at = @At("HEAD"))
    private void edge$beforeWorld(
            int pass,
            float partialTicks,
            long finishTimeNano,
            CallbackInfo ci
    ) {
        // 读取模块状态后处理。
    }
}
```

创建类后，将相对 `top.fpsmaster.forge.mixin` 的类名追加到 `src/main/resources/mixins.fpsmaster.json` 的 `mixins` 或 `client` 数组。不要覆盖已有列表。

优先使用 `@Inject`、`@Redirect` 或 `@ModifyVariable` 做局部修改。`@Overwrite` 的冲突范围更大，只在没有合适注入点时使用。

## 添加命令

当前命令主要以匿名类直接注册在 `CommandManager.init()`，不要照旧教程创建并不存在的 `features.command.impl` 包：

```java
commands.add(new Command("hello", "hello <name>") {
    @Override
    public void execute(String[] args) throws CommandException {
        require(args.length == 1, "hello <name>");
        Utility.sendClientNotify("Hello, " + args[0]);
    }
});
```

默认聊天前缀由 `ClientSettings.prefix` 提供。参数错误应返回明确用法，不要吞掉异常。

## 配置与提交检查

模块开关和 `Setting` 会由配置系统持久化。只有不属于模块的全局值才需要接入 `Configure` 或单独的配置对象。

提交前检查：

- 模块和 HUD 均已注册。
- 新 Mixin 已加入 `mixins.fpsmaster.json`。
- 中英文语言键均已补齐。
- 玩家、世界、文件和反射结果已处理空值。
- `./gradlew test` 与 `./gradlew build` 通过。
- 已在 Minecraft Forge 1.8.9 中手动验证。
