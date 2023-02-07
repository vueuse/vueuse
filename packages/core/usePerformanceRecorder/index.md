---
category: Browser
---

# usePerformanceRecorder

Record page performance indicators

* 使用clear清除全局的监听

## Parameter meaning

| 属性    | 含义(ms) |
| -------- | ------- |
| lookup  | DNS 查询时间   |
| receiving | network 耗费时长     |
| parsing   | dom 解析时长    |
| contentLoaded  | 页面内容完全加载完毕时长    |
| redirect   | 重定向的时间    |
| ttfb  | 读取页面第一个字节的时间    |
| loadEvent | 执行 onload 回调函数的时间    |
| appcache   | DNS 缓存时间 |
| unloadEvent  | 卸载页面的时间 |
| connect   | TCP 建立连接完成握手的时间    |
| FP  | 首屏绘制   |
| FCP  | 首屏内容绘制   |
| CLS | 累计位移偏移     |
| TTI   | 首次可交互时间    |
| LCP | 最大内容绘制    |

## Usage

```js
import { usePerformanceRecorder } from '@vueuse/core'
const recorderInfo = usePerformanceRecorder()
```

## Component Usage
```html
<UsePerformanceRecorder v-slot="{ recorderInfo }">
  Print : {{ recorderInfo }}
</UsePerformanceRecorder>
```
