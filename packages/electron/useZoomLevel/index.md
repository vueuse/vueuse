---
category: '@Electron'
---

# useZoomLevel

Reactive [WebFrame](https://www.electronjs.org/docs/api/web-frame#webframe) zoom level.

## Usage

```ts
import { useZoomLevel } from '@vueuse/electron'

// enable nodeIntegration if you don't provide webFrame explicitly
// @see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// Ref result will return
const level = useZoomLevel()
console.log(level.value) // print current zoom level
level.value = 2 // change current zoom level
```

Set initial zoom level immediately

```js
import { useZoomLevel } from '@vueuse/electron'

const level = useZoomLevel(2)
```

Pass a `ref` and the level will be updated when the source ref changes

```js
import { useZoomLevel } from '@vueuse/electron'

const level = ref(1)

useZoomLevel(level) // zoom level will match with the ref

level.value = 2 // zoom level will change
```
