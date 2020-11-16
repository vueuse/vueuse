# useEventListener

> Use EventListener with ease. Register using [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) on mounted, and [removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) automatically on unmounted.

## Usage

```js
import { useEventListener } from '@vueuse/core'

useEventListener('mousemove', (evt) => { console.log(evt) })
```

Custom Event Target

```ts
useEventListener(document, 'visibilitychange', (evt) => { console.log(evt) })
```
