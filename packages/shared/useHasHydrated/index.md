---
category: Utilities
---

# useHasHydrated

Helper to use client-only values safe from hydration mismatch.

While you can normally use `onMounted` for SSR safety, this comes with one big drawback: if you use your component in another page of your application or a v-if,
meaning there is no server side rendering and hydration involved, until the `onMounted` hook fires you will get your SSR placeholder value, this creates jerkiness, can cause unwanted layout shifts and your UI to feel slow.
While you cannot avoid the jerking the first time your app is loaded with SSR, you can avoid it in the rest of the session with `useHasHydrated` instead of `onMounted`.

::: tip NOTE
Beware to only use the ref of hasHydrated in the render function, onBeforeMount or onMounted,
if you use it in the setup function directly without preserving reactivity, the server will not render the expected output
::: tip

## Usage

```ts
import { useHasHydrated } from '@vueuse/shared'
import { watch } from 'vue'

const hasHydrated = useHasHydrated()
const windowWidth = computed(() => hasHydrated.value && window ? window.innerWidth : 700)
console.log(hasHydrated.value, windowWidth.value)
```
