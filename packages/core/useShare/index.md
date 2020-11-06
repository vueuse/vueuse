# useShare

> Reactive [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share). The Browser provides features that can share content in text or file.

## Usage

```js
import { useShare } from '@vueuse/core'

const { share, isSupported } = useShare({ title: 'Hello', text: 'Hello my friend!', url: location.href })

if (isSupported) share()
```

