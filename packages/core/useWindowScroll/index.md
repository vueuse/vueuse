---
category: Elements
---

# useWindowScroll

Reactive window scroll

## Usage

```js
import { useWindowScroll } from '@vueuse/core'

const { x, y } = useWindowScroll()
console.log(x.value) // read current x scroll value
y.value = 100 // scroll y to 100
```
