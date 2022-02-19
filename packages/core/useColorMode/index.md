---
category: Browser
---

# useColorMode

Reactive color mode (dark / light / customs) with auto data persistence.

## Basic Usage

```js
import { useColorMode } from '@vueuse/core'

const mode = useColorMode() // Ref<'dark' | 'light'>
```

By default, it will match with users' browser preference using `usePreferredDark` (a.k.a `auto` mode). When reading the ref, it will always return the current color mode (`dark`, `light` or your custom modes). When writing to the ref, it will trigger DOM updates and persist the color mode to local storage (or your custom storage). You can pass `auto` to set back to auto mode.

```ts
mode.value // 'dark' | 'light'

mode.value = 'dark' // change to dark mode and persist

mode.value = 'auto' // change to auto mode
```

## Config

```js
import { useColorMode } from '@vueuse/core'

const mode = useColorMode({
  attribute: 'theme',
  modes: {
    // custom colors
    dim: 'dim',
    cafe: 'cafe',
  },
}) // Ref<'dark' | 'light' | 'dim' | 'cafe'>
```

## Component

```html
<UseColorMode v-slot="{ mode }">
  <button @click="mode = mode === 'dark' ? 'light' : 'dark'">
    Mode {{ mode }}
  </button>
</UseColorMode>
```

## Related Functions

- `useDark`
- `usePreferredDark`
- `useStorage`

## Advanced Usage

When accessing `useColorMode()` in multiple components, the different instances of mode will not be reactive between each other.

Example:

```
components
|-- DarkModeToggle.vue

app.vue
...
```

```html
<!-- DarkModeToogle.vue -->

<template>
  Toggle HTML...
</template>

<script setup lang="ts">
const color = useColorMode();

function toggleDark(): void {
  color.value = color.value === 'dark' ? 'light' : 'dark';
}
</script>

<!-- app.vue -->

<template>
  <DarkModeToggle />
  <p>
    Mode: {{ color }}
  </p>
</template>

<script setup lang="ts">
  const color = useColorMode();
</script>
```

With the above code, the `color` variable in `app.vue` will not update if we toggle it with the `DarkModeToggle` component.

To solve this we can use a composable like so:

```
composables
|-- useColorModeReactive()
```

```js
import { useColorMode } from '@vueuse/core';
import { ref } from 'vue';

const color = ref();
export function useColorModeReactive() {
  if (color.value) return color;
  color.value = useColorMode()?.value;
  return color;
}
```

and replace `useColorMode()` in the example with `useColorModeReactive()` and it will work.
