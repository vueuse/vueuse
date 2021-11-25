---
category: '@Nuxt'
---

# useNuxtDark

Reactive dark mode with auto data persistence for Nuxt.

Similar to `useDark` but use `useCookie` and `useMeta` from Nuxt instead of localStorage to make SSR rendered pages aware of user's preference.


## Usage

```js
// import is optional, Nuxt will handles auto-import for you
import { useNuxtDark } from '@vueuse/nuxt'

const isDark = useNuxtDark()
const toggleDark = useToggle(isDark)
```
