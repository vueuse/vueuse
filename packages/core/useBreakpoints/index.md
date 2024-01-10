---
category: Browser
---

# useBreakpoints

Reactive viewport breakpoints and screen factor.

## Usage

```js
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger
const largerThanSm = breakpoints.greater('sm') // only larger than sm
const lgAndSmaller = breakpoints.smallerOrEqual('lg') // lg and smaller
const smallerThanLg = breakpoints.smaller('lg') // only smaller than lg
```

To set reactive screen factor CSS class globally in the `App.vue`:

```vue
<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  mobile: 0, // optional
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
})

// Can be 'mobile' or 'tablet' or 'laptop' or 'desktop'
const mode = breakpoints.mode()

// true or false
const laptop = breakpoints.between('laptop', 'desktop')
</script>

<template>
  <div :class="mode">
    ...
  </div>
</template>
```
