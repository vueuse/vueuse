---
sidebar: auto
---

# Guidelines

Writing good composables can be difficult, so we've created a small set of guidelines you can follow to improve your composables!

## General
- Avoid using console logs in VueUse
- Use configurableWindow (etc.) when using global variables like window to be flexible when working with multi-windows, testing mocks, and SSR.
- Use options object as arguments whenever possible to be more flexible for future extensions.
- Use `ref` over `reactive` whenever possible
- Use `shallowRef` instead of `ref` when wrapping large amounts of data.
- When involved with Web APIs that are not yet implemented by the browser widely, also outputs `isSupported` flag
- When using `watch` or `watchEffect` internally, also make the `immediate` and `flush` options configurable whenever possible
- Use `tryOnUnmounted`  to clear the side-effects gracefully


## Controls

In VueUse 5.0, we introduced a `controls` option, allowing you to write functions that can return both a single value as well as
an object with controls.

*When to provide a `controls` option*

- If the return value of the function is often used without controls
- Examples: `useTimestamp`, `useInterval`,

**Instead of this**
```ts
const { timestamp, pause, resume } = useTimestamp()
```

**Do this**
```ts
const timestamp = useTimestamp()
const { timestamp, pause, resume } = useTimestamp({ controls: true })
```

*When **not** to provide a `controls` option*
- If the function is often used without a return value
- If controls are the primary use of the function
- Examples: `useRafFn`,

**Instead of this**
```ts
const { pause, resume } = useRafFn(() => {}, { controls: true })
```

**Do this**
```ts
const { pause, resume } = useRafFn(() => {})
```

## Renderless Components

- Use render functions instead of Vue SFC
- Wrap the props in `reactive` to easily pass them as props to the slot
- Prefer to use the functions options as prop types instead of recreating them yourself
- Only wrap the slot in an html element if the function needs a target to bind to

**Instead of this**
```html
<script setup>
import { useMouse } from '@vueuse/core'
const mouse = useMouse()
</script>

<template>
  <slot v-bind="mouse">
</template>
```

**Do this**
```ts
import { defineComponent, reactive } from 'vue-demi'
import { useMouse, MouseOptions } from '@vueuse/core'

export const UseMouse = defineComponent<MouseOptions>({
  name: 'UseMouse',
  props: ['touch', 'resetOnTouchEnds', 'initialValue'] as unknown as undefined,
  setup(props, { slots }) {
    const data = reactive(useMouse(props))

    return () => {
      if (slots.default)
        return slots.default(data)
    }
  },
})
```

Sometimes a function may have multiple parameters, in that case you maybe need to create a new interface to merge all the interfaces
into a single interface for the component props.

```ts
import { useTimeAgo, TimeAgoOptions } from '@vueuse/core'

interface UseTimeAgoComponentOptions extends Omit<TimeAgoOptions<true>, 'controls'> {
  time: MaybeRef<Date | number | string>
}

export const UseTimeAgo = defineComponent<UseTimeAgoComponentOptions>({...})
```