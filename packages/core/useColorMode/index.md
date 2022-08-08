---
category: Browser
related:
  - useDark
  - usePreferredDark
  - useStorage
---

# useColorMode

Reactive color mode (dark / light / customs) with auto data persistence.

## Basic Usage

```js
import { useColorMode } from '@vueuse/core'

const mode = useColorMode() // Ref<'dark' | 'light'>
```

By default, it will match with users' browser preference using `usePreferredDark` (a.k.a `auto` mode). When reading the ref, it will by default return the current color mode (`dark`, `light` or your custom modes). The `auto` mode can be included in the returned modes by enabling the `emitAuto` option. When writing to the ref, it will trigger DOM updates and persist the color mode to local storage (or your custom storage). You can pass `auto` to set back to auto mode.

```ts
mode.value // 'dark' | 'light'

mode.value = 'dark' // change to dark mode and persist

mode.value = 'auto' // change to auto mode
```

## State Usage

You can pass `state` to the `useColorMode` function to get an object with the following properties:
- `setting`: Read or set the mode setting
- `currentMode`: Get the cureent applied mode
- `isDark`: `true` when the cureent applied mode is dark

The `state` option is useful when you want to know the mode setting (auto) and have access to the current applied mode (dark/light ...).

```js
import { useColorMode } from '@vueuse/core'

const state = useColorMode({}, 'state')
state.setting.value // auto (by default)
state.currentMode.value // 'dark' | 'light' (based on user preference)
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

## Component Usage

```html
<UseColorMode v-slot="{ mode }">
  <button @click="mode = mode === 'dark' ? 'light' : 'dark'">
    Mode {{ mode }}
  </button>
</UseColorMode>
```
