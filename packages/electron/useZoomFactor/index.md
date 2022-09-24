---
category: '@Electron'
---

# useZoomFactor

Reactive [WebFrame](https://www.electronjs.org/docs/api/web-frame#webframe) zoom factor.

## Usage

```ts
import { useZoomFactor } from '@vueuse/electron'

// enable nodeIntegration if you don't provide webFrame explicitly
// @see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// Ref result will return
const factor = useZoomFactor()
console.log(factor.value) // print current zoom factor
factor.value = 2 // change current zoom factor
```

Set initial zoom factor immediately

```js
import { useZoomFactor } from '@vueuse/electron'

const factor = useZoomFactor(2)
```

Pass a `ref` and the factor will be updated when the source ref changes

```js
import { useZoomFactor } from '@vueuse/electron'

const factor = ref(1)

useZoomFactor(factor) // zoom factor will match with the ref

factor.value = 2 // zoom factor will change
```
