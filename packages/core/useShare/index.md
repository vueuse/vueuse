# useShare

> The Browser provides features that can share content in text or file, see more: [Web Share Api](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share).

## Usage

```js
import { useShare } from '@vueuse/core'

function onShare () {
  useShare({ title: 'Hello', text: 'Hello my friend!', url: location.href })
}
```

