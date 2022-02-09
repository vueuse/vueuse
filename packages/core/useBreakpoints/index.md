---
category: Browser
---

# useBreakpoints

Reactive viewport breakpoints

## Usage

```js
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greater('sm')
```

```js
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
})

const laptop = breakpoints.between('laptop', 'desktop')
```
