---
category: Browser
---

# useCssSupports

SSR compatible and reactive [`CSS.supports`](https://developer.mozilla.org/docs/Web/API/CSS/supports_static).

## Usage

```ts
import { useCssSupports } from '@vueuse/core'

const { isSupported } = useCssSupports('container-type', 'scroll-state')
```
