# Cadence

Cadence 是 Java 8 音乐数据客户端。它提供网易云音乐和 QQ 音乐的搜索、播放直链、歌词与二维码登录接口。

Cadence 只取数据，不播放音频，也不提供界面。`SongUrl.url` 应交给宿主自己的播放器。

源码位于 [Cadence](https://github.com/FPSMasterTeam/Cadence)，采用 MIT 许可证。

## 引入

当前公开 tag 是 `v0.1.1`，通过 JitPack 获取：

```kotlin
repositories {
    maven("https://jitpack.io")
}

dependencies {
    implementation("com.github.FPSMasterTeam:Cadence:v0.1.1")
}
```

源码包名仍是 `top.fpsmaster.music.*`。本地 `publishToMavenLocal` 使用另一组坐标：

```text
top.fpsmaster:music-api:0.1.1
```

库本身输出 Java 8 字节码。运行时还需要 Kotlin 标准库和 Gson；正常的 Gradle 依赖解析会带入它们。若宿主关闭传递依赖或将 Cadence 打进自己的 jar，需要自行保证这两个运行时依赖存在。

## 使用 MusicService

`MusicService` 是统一入口。调用方选择音乐来源，返回值使用同一组模型：

```kotlin
import top.fpsmaster.music.AudioQuality
import top.fpsmaster.music.MusicService
import top.fpsmaster.music.MusicSource

val music = MusicService()
val tracks = music.search(MusicSource.NETEASE, "搜索关键词")

val track = tracks.firstOrNull()
if (track != null) {
    val song = music.getSongUrl(track, AudioQuality.STANDARD)
    if (song.available) {
        player.play(song.url!!)
    } else {
        logger.warn(song.reason ?: "没有可用直链")
    }
}
```

不要假设请求的音质一定可用。检查：

- `available`：是否有直链。
- `quality`：实际返回的音质，可能低于请求值。
- `isTrial`：是否为试听片段。
- `reason`：不可用时的原因。

会员内容、地区限制和登录状态都可能让链接降级或为空。

调用音乐平台服务时应遵守对应平台条款，只使用自己的账户和获授权访问的内容。播放直链可能受时效和账户状态限制，不要记录后再次分发。

## 歌词

`MusicService.getLyric(track)` 已返回解析后的时间轴：

```kotlin
val lyric = music.getLyric(track)
for (line in lyric.lines) {
    renderLine(
        startMs = line.startMs,
        text = line.text,
        translation = line.translation
    )
}
```

网易云结果可能包含逐字时间：

```kotlin
for (word in line.words) {
    highlight(word.text, word.startMs, word.durationMs)
}
```

只需要离线解析已有文本时，直接使用 `LyricParser`：

```kotlin
import top.fpsmaster.music.lyric.LyricParser

val lines = LyricParser.parse(
    lrc = lrcText,
    translated = translatedText,
    yrc = wordByWordText
)
```

解析器支持标准 LRC、时间偏移、单行多时间戳、翻译对齐和网易云 YRC 逐字数据。它不发起网络请求。

## 二维码登录

二维码由宿主显示和轮询：

```kotlin
val qr = music.createQrCode(MusicSource.NETEASE)
showQrCode(qr.qrContent)

val state = music.checkQrCode(MusicSource.NETEASE, qr)
when (state) {
    QrLoginState.WAITING -> showStatus("等待扫码")
    QrLoginState.SCANNED -> showStatus("等待确认")
    QrLoginState.CONFIRMED -> showStatus("登录成功")
    QrLoginState.EXPIRED -> requestNewQrCode()
    QrLoginState.ERROR -> showStatus("登录失败")
}
```

网易云的 `qrContent` 是待编码为二维码的 URL。QQ 音乐的 `qrContent` 是 data URL。登录成功后，凭证写入对应的 `NeteaseMusicApi` 或 `QQMusicApi` 实例。

轮询应由宿主调度。不要在渲染线程中循环等待。

## 凭证存储

`MusicCredentialStore` 是可选工具。存储路径由宿主提供：

```kotlin
val store = MusicCredentialStore.inDir(appPrivateDataDir)
store.load()

music.netease.cookie = store.neteaseCookie
music.qq.musicid = store.qqMusicId
music.qq.musicKey = store.qqMusicKey
```

登录成功后再调用 `setNetease` 或 `setQq` 保存当前实例中的凭证。示例不包含真实 Cookie。生产环境应使用用户私有目录，并按平台能力限制文件访问权限。不要把凭证写进日志、仓库或同步配置。

## 日志 SPI

Cadence 默认不输出日志。宿主可以替换 `MusicLog.logger`：

```kotlin
MusicLog.logger = object : MusicLogger {
    override fun info(msg: String) {
        appLogger.info(msg)
    }

    override fun error(msg: String, t: Throwable?) {
        appLogger.error(msg, t)
    }
}
```

接入时避免记录请求凭证和完整响应头。

## 开发 Cadence

使用 JDK 17 或 21 运行仓库的 Gradle 9 Wrapper，不要用 JDK 8 启动 Gradle。编译产物仍是 Java 8 字节码。

```bash
git clone https://github.com/FPSMasterTeam/Cadence.git
cd Cadence
./gradlew build
./gradlew publishToMavenLocal
```

`build` 会编译 Java 8 目标字节码并运行测试。修改 `MusicService` 或平台客户端时，至少覆盖空结果、不可用直链、过期二维码和异常响应。修改 `LyricParser` 时补充纯文本单元测试。

不要在使用文档中固化平台内部签名步骤。平台接口发生变化时，应在库内修复并保持 `MusicService` 的公共入口稳定。
