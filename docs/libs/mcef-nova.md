# mcef-nova

mcef-nova 是与 Minecraft 版本解耦的 CEF 组件。它处理 JCEF 生命周期、离屏浏览器输入和浏览器帧纹理，不直接调用 Minecraft 渲染 API。

源码可见，已发布制品经 GitHub Packages 分发。许可证是 LGPL-2.1。Nova 当前消费版本 `1.0.1`，并在自身仓库的 `vendor/maven` 中保留了离线制品。

源码仓库：[mcef-nova](https://github.com/FPSMasterTeam/mcef-nova)。

## 在 Nova 中使用

Nova 的 `vendor/maven` 包含 mcef-nova `1.0.1` 的 jar、源码 jar 和 Maven 元数据。Gradle 会先从该目录解析依赖，因此普通贡献者克隆并构建 Nova 时不需要 GitHub 令牌。

## 直接消费 GitHub Packages

只有其他项目直接从 GitHub Packages 解析 mcef-nova 时，才需要配置 `gpr.user` 和 `gpr.key`。将用户名和具有 `read:packages` 权限的令牌放入用户级 Gradle 配置：

```properties
# ~/.gradle/gradle.properties
gpr.user=<GitHub 用户名>
gpr.key=<具有 read:packages 权限的令牌>
```

不要把令牌写进项目的 `gradle.properties`、构建脚本或提交记录。

在消费方配置仓库和依赖：

```kotlin
repositories {
    maven {
        url = uri("https://maven.pkg.github.com/FPSMasterTeam/mcef-nova")
        credentials {
            username = project.findProperty("gpr.user") as String?
            password = project.findProperty("gpr.key") as String?
        }
    }
}

dependencies {
    implementation("com.github.FPSMasterTeam:mcef-nova:1.0.1")
}
```

GitHub Packages 即使读取也可能要求仓库或账号具备包访问权限。

## 宿主职责

mcef-nova 不依赖 `net.minecraft`。宿主需要完成四件事：

1. 实现并安装 `MCEFHost`。
2. 在合适的线程初始化和更新 CEF。
3. 将浏览器输入转发给 `MCEFBrowser`。
4. 读取 OpenGL 纹理 ID，并用目标 Minecraft 版本的渲染 API 绘制。

`MCEFHost` 只定义调度、窗口句柄和可选的退出回调：

```java
MCEF.INSTANCE.setHost(new MCEFHost() {
    @Override
    public void schedule(Runnable task) {
        client.execute(task);
    }

    @Override
    public long windowHandle() {
        return clientWindowHandle;
    }

    @Override
    public void stopGame() {
        client.stop();
    }
});
```

`schedule` 必须把任务交给拥有 OpenGL 上下文的客户端或渲染线程。`windowHandle` 返回 GLFW 窗口句柄。没有合适退出钩子的宿主可以不重写 `stopGame()`。

## 初始化与帧循环

先安装 `MCEFHost`，再准备本地 CEF 资源并调用初始化。创建浏览器前检查初始化结果：

```java
boolean ready = MCEF.INSTANCE.initialize();
if (!ready) {
    throw new IllegalStateException("CEF 初始化失败");
}

MCEFBrowser browser = MCEF.INSTANCE.createBrowser(
        initialUrl,
        true,
        width,
        height,
        null
);
```

每个渲染帧在宿主渲染线程调用一次：

```java
MCEF.INSTANCE.update();
```

这一步会推进消息循环或把待处理浏览器帧上传到纹理。不要从任意后台线程调用。

窗口尺寸变化时调用 `browser.resize(width, height)`。键盘、鼠标和滚轮通过 `MCEFBrowser` 的 `sendKey*`、`sendMouse*` 方法转发。坐标应使用浏览器自己的像素尺寸。

## 绘制纹理

mcef-nova 的公开边界是普通 OpenGL 纹理：

```java
MCEFRenderer renderer = browser.getRenderer();
if (renderer.isTextureReady() && !renderer.isUnpainted()) {
    int textureId = renderer.getTextureId();
    boolean bgra = renderer.isBGRA();
    drawBrowserTexture(textureId, bgra, x, y, width, height);
}
```

`getTextureId()` 可能在首帧到达前返回 `0`。宿主应检查 `isTextureReady()`，并根据 `isBGRA()` 选择正确的采样或通道处理。

库不会把纹理包装成 `GuiGraphics`、`GpuTexture` 或其他 Minecraft 对象。立即模式、`GuiRenderState` 和后续渲染接口的适配都属于宿主。

关闭页面时调用 `browser.close()`。客户端退出时，在 OpenGL 上下文仍有效的阶段关闭所有浏览器，再调用：

```java
MCEF.INSTANCE.shutdown();
```

## 从源码构建

mcef-nova 将 `java-cef` 目录直接纳入仓库，仓库没有 `.gitmodules`，不需要初始化子模块：

```bash
git clone https://github.com/FPSMasterTeam/mcef-nova.git
cd mcef-nova
./gradlew build
```

库输出 Java 17 字节码。LWJGL、SLF4J、Guava 和部分 Apache Commons 依赖由 Minecraft 宿主提供，构建脚本将它们声明为 `compileOnly`。接入其他宿主时要自行提供兼容版本。

开发中的版本号不等于已发布制品。消费方继续使用 `1.0.1`，直到 GitHub Packages 中存在新的正式版本。
