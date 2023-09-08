---
category: Browser
---

# useEventListener

Use EventListener with ease. Register using [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) on mounted, and [removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) automatically on unmounted.

## Usage

```js
import { useEventListener } from '@vueuse/core'

useEventListener(document, 'visibilitychange', (evt) => {
  console.log(evt)
})
```

You can also pass a ref as the event target, `useEventListener` will unregister the previous event and register the new one when you change the target.

```ts
import { useEventListener } from '@vueuse/core'

const element = ref<HTMLDivElement>()
useEventListener(element, 'keydown', (e) => {
  console.log(e.key)
})
```

```html
<template>
  <div v-if="cond" ref="element">Div1</div>
  <div v-else ref="element">Div2</div>
</template>
```

You can also call the returned to unregister the listener.

```ts
import { useEventListener } from '@vueuse/core'

const cleanup = useEventListener(document, 'keydown', (e) => {
  console.log(e.key)
})

cleanup() // This will unregister the listener.
```

Note if your components also run in SSR (Server Side Rendering), you might get errors (like `document is not defined`) because DOM APIs like `document` and `window` are not available in Node.js. To avoid that you can put the logic inside `onMounted` hook.

```ts
// onMounted will only be called in the client side, so it guarantees the DOM APIs are available.
onMounted(() => {
  useEventListener(document, 'keydown', (e) => {
    console.log(e.key)
  })
})
```
