---
category: Browser
---

# useMediaQuery

Reactive [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries). Once you've created a MediaQueryList object, you can check the result of the query or receive notifications when the result changes.

## Usage

```js
import { useMediaQuery } from '@vueuse/core'

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')
```

#### Server Side Rendering and Nuxt

If you are using `useMediaQuery` with SSR enabled, then you need to specify which screen size you would like to render on the server and before hydration to avoid an hydration mismatch

```js
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useMediaQuery(
  '(min-width: 1024px)',
  { ssrSize: 768 } // Will enable SSR mode and render like if the screen was 768px wide
)

console.log(breakpoints.value) // always false because ssrSize of 768px is smaller than 1024px
onMounted(() => {
  console.log(breakpoints.value) // false if screen is smaller than 1024px, true if >= than 1024px
})
```
