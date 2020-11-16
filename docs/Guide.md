# 💡 Guide

VueUse is a collection of utility functions based on [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html). We assume you are already familiar with the basic ideas of [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) before you continue the read.

This guide is trying to explain to you some of the philosophy and recommended usages across the entire collection.

## Destructuring

Most of the functions in VueUse returns an object of refs that you can use [ES6's object destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) syntax to take what you want. For example:

```ts
import { useMouse } from '@vueuse/core'

const { x, y } = useMouse()

// "x" and "y" will be "Ref<number>"
console.log(x.value) // 153
```

If you prefer to use them as object properties style, you can unwrap the refs by using `reactive()`. For example:

```ts
import { reactive } from 'vue' 
import { useMouse } from '@vueuse/core'

const mouse = reactive(useMouse())

// "x" and "y" will be auto unwrapped, no `.value` needed
console.log(mouse.x) // 153
```

## Event Filters

From v4.0, we provide the Event Filters system to give the flexibility to control when will events get triggered. For example, you can use `throttleFilter` and `throttleFilter` to control the event trigger rate:

```ts
import { throttleFilter, debounceFilter, useLocalStorage, useMouse } from '@vueuse/core'

// changes will write to localStorage with a throttled 1s
const storage = useLocalStorage('my-key', { foo: 'bar' }, { eventFilter: throttleFilter(1000) })

// mouse position will be updated after mouse idle for 100ms
const { x, y } = useMouse({ eventFilter: debounceFilter(100) })
```

Moreover, you can utilize `pauseableFilter` to temporarily pause some events.

```ts
import { pauseableFilter, useDeviceMotion } from '@vueuse/core'

const motionControl = pauseableFilter()

const motion = useDeviceMotion({ eventFilter: motionControl.eventFilter })

motionControl.pause() 

// motion updates will be paused

motionControl.resume()

// motion updates will be resumed
```

## Reactive Timing

VueUse composables follow Vue's reactivity system defaults for [flush timing](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#effect-flush-timing) where possible. 

For `watch`-like composables (e.g. `pausableWatch`, `when`, `useStorage`, `useRefHistory`) the default is `{ flush: 'pre' }`. Which means they will buffer invalidated effects and flush them asynchronously. This avoids unnecessary duplicate invocation when there are multiple state mutations happening in the same "tick".

In the same way as with `watch`, VueUse allows users to configure the timing by passing the `flush` option

```ts
const { pause, resume } = pausableWatch(
  () => {
    // Safely access rendered DOM
  },
  { flush: 'post' }
)
```

**flush option (default: `'pre'`)**
- `'pre'`: buffers invalidated effects in the same 'tick' and flushes them before rendering
- `'post'`: async like 'pre' but fires after component updates so you can access the updated DOM
- `'sync'`: forces the effect to always trigger synchronously

**Note:** For `computed`-like composables (e.g. `syncRef`, `controlledComputed`), when flush timing is configurable, the default is changed to `{ flush: 'sync' }` to align them with the way computed refs works in Vue.

## Configurable Global Dependencies

From v4.0, functions that access the browser APIs will provide options fields for you to specify the global dependencies (e.g. `window`, `document` and `navigator`). Most of the time, you don't need to configure it, it will use the global instance by default. This configure is useful when working with iframes and testing environments.

```ts
// accessing parent context
const parentMousePos = useMouse({ window: window.parent })

const iframe = document.querySelect('#my-iframe')

// accessing child context
const childMousePos = useMouse({ window: iframe.contextWindow })
```

```ts
// testing
const mockWindow = /* ... */

const { x, y } = useMouse({ window: mockWindow })
```
