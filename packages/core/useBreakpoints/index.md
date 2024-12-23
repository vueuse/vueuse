---
category: Browser
---

# useBreakpoints

Reactive viewport breakpoints.

## Usage

```js
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger
const largerThanSm = breakpoints.greater('sm') // only larger than sm
const lgAndSmaller = breakpoints.smallerOrEqual('lg') // lg and smaller
const smallerThanLg = breakpoints.smaller('lg') // only smaller than lg
```

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
const activeBreakpoint = breakpoints.active()

// true or false
const laptop = breakpoints.between('laptop', 'desktop')
</script>

<template>
  <div :class="activeBreakpoint">
    ...
  </div>
</template>
```

#### Server Side Rendering and Nuxt

If you are using `useBreakpoints` with SSR enabled, then you need to specify which screen size you would like to render on the server and before hydration to avoid an hydration mismatch

```js
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(
  breakpointsTailwind,
  { ssrWidth: 768 } // Will enable SSR mode and render like if the screen was 768px wide
)
```

Alternatively you can set this up globally for your app using [`provideSSRWidth`](../useSSRWidth/index.md)

## Presets

- Tailwind: `breakpointsTailwind`
- Bootstrap v5: `breakpointsBootstrapV5`
- Vuetify v2: `breakpointsVuetifyV2` (deprecated: `breakpointsVuetify`)
- Vuetify v3: `breakpointsVuetifyV3`
- Ant Design: `breakpointsAntDesign`
- Quasar v2: `breakpointsQuasar`
- Sematic: `breakpointsSematic`
- Master CSS: `breakpointsMasterCss`
- Prime Flex: `breakpointsPrimeFlex`
- ElementUI / ElementPlus: `breakpointsElement`

_Breakpoint presets are deliberately not auto-imported, as they do not start with `use` to have the scope of VueUse. They have to be explicitly imported:_

```js
import { breakpointsTailwind } from '@vueuse/core'
// and so on
```
