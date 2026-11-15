# Best Practice

### Destructuring

Most of the functions in VueUse return an **object of refs** that you can use [ES6's object destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) syntax on to take what you need. For example:

```ts twoslash
import { useMouse } from '@vueuse/core'

// "x" and "y" are refs
const { x, y } = useMouse()

console.log(x.value)

const mouse = useMouse()

console.log(mouse.x.value)
```

If you prefer to use them as object properties, you can unwrap the refs by using `reactive()`. For example:

```ts twoslash
import { useMouse } from '@vueuse/core'
import { reactive } from 'vue'

const mouse = reactive(useMouse())

// "x" and "y" will be auto unwrapped, no `.value` needed
console.log(mouse.x)
```

### Initial Values & Readonly State

State that only the composable writes, like a window size or a mouse position, is returned as **readonly refs**. To set the values used before the first update (e.g. during SSR or in tests), pass them through the `initials` option:

```ts twoslash
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize({
  initials: { width: 1280, height: 720 },
})
```

If you need to own the state, pass your own refs. The composable writes into them, and the returned refs are readonly views of the same state:

```ts twoslash
import { useWindowSize } from '@vueuse/core'
import { shallowRef } from 'vue'

const width = shallowRef(1280)
const height = shallowRef(720)

useWindowSize({ initials: { width, height } })

width.value = 1024 // allowed, you own this ref
```

Don't pass a `computed` in `initials`: the composable writes into it on the first update.

### Side-effect Clean Up

Similar to Vue's `watch` and `computed` that will be disposed when the component is unmounted, VueUse's functions also clean up the side-effects automatically.

For example, `useEventListener` will call `removeEventListener` when the component is unmounted.

```ts twoslash
import { useEventListener } from '@vueuse/core'
// ---cut---
// will cleanup automatically
useEventListener('mousemove', () => {})
```

All VueUse functions follow this convention.

To manually dispose the side-effects, some functions return a stop handler just like the `watch` function. For example:

```ts twoslash
import { useEventListener } from '@vueuse/core'
// ---cut---
const stop = useEventListener('mousemove', () => {})

// ...

// unregister the event listener manually
stop()
```

Not all functions return a `stop` handler so a more general solution is to use the [`effectScope` API](https://vuejs.org/api/reactivity-advanced.html#effectscope) from Vue.

```ts
import { effectScope } from 'vue'

const scope = effectScope()

scope.run(() => {
  // ...

  useEventListener('mousemove', () => {})
  onClickOutside(el, () => {})
  watch(source, () => {})
})

// all composables called inside `scope.run` will be disposed
scope.stop()
```

You can learn more about `effectScope` in [this RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md).

### Reactive Arguments

In Vue, we use the `setup()` function to construct the "connections" between data and logic. To make it flexible, most of the VueUse functions also accept refs for the arguments because refs are reactive.

Take `useTitle` as an example:

###### Non-reactive Argument

The `useTitle` composable helps you get and set the current page's `document.title` property.

```ts twoslash
// @lib: dom
import { useDark, useTitle } from '@vueuse/core'
import { watch } from 'vue'
// ---cut---
const isDark = useDark()
const title = useTitle('Hello')

console.log(document.title) // "Hello"

watch(isDark, () => {
  title.value = isDark.value ? '🌙 Good evening!' : '☀️ Good morning!'
})
```

###### Ref Argument

You can pass a ref into `useTitle` instead of using the returned ref.

```ts twoslash
import { useDark, useTitle } from '@vueuse/core'
import { computed } from 'vue'
// ---cut---
const isDark = useDark()
const title = computed(() => isDark.value ? '🌙 Good evening!' : '☀️ Good morning!')

useTitle(title)
```

###### Reactive Getter Argument

Since VueUse 9.0, we introduced a new convention for passing a "Reactive Getter" as the argument, which works great with reactive objects and [Reactivity Transform](https://vuejs.org/guide/extras/reactivity-transform.html#reactivity-transform).

```ts twoslash
import { useDark, useTitle } from '@vueuse/core'
// ---cut---
const isDark = useDark()

useTitle(() => isDark.value ? '🌙 Good evening!' : '☀️ Good morning!')
```
