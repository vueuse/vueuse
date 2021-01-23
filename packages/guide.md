---
sidebar: 'auto'
---

# Get Started

VueUse is a collection of utility functions based on [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html). We assume you are already familiar with the basic ideas of [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) before you continue.

## Installation

> 🎩 From v4.0, it works for Vue 2 & 3 **within a single package** by the power of [Vue Demi](https://github.com/antfu/vue-demi)!

### NPM

```bash
npm i @vueuse/core # yarn add @vueuse/core
```

Vue 3 Demo: [Vite](https://github.com/antfu/vite-vueuse-starter), [Webpack](https://github.com/vueuse/vueuse-next-example) / Vue 2 Demo: [Vue CLI](https://github.com/vueuse/vueuse-vue2-example)

### CDN

```html
<script src="https://unpkg.com/@vueuse/core"></script>
```

It will be exposed to global as `window.VueUse`


## Usage Example

Simply importing the functions you need from `@vueuse/core`

```ts
import { useMouse, usePreferredDark, useLocalStorage } from '@vueuse/core'

export default {
  setup() {
    // tracks mouse position
    const { x, y } = useMouse()

    // is user prefers dark theme
    const isDark = usePreferredDark()

    // persist state in localStorage
    const store = useLocalStorage(
      'my-storage', 
      {
        name: 'Apple',
        color: 'red',
      },
    )

    return { x, y, isDark, store }
  }
})
```

Refer to [functions list](./functions) for more details.

## Best Practice

### Destructuring

Most of the functions in VueUse returns an **object of refs** that you can use [ES6's object destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) syntax to take what you need. For example:

```ts
import { useMouse } from '@vueuse/core'

// "x" and "y" are refs
const { x, y } = useMouse()

console.log(x.value)

const mouse = useMouse()

console.log(mouse.x.value)
```

If you prefer to use them as object properties style, you can unwrap the refs by using `reactive()`. For example:

```ts
import { reactive } from 'vue' 
import { useMouse } from '@vueuse/core'

const mouse = reactive(useMouse())

// "x" and "y" will be auto unwrapped, no `.value` needed
console.log(mouse.x)
```

## Configurations

These show the general configurations for most of the functions in VueUse.

### Event Filters

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

// motion updates paused

motionControl.resume()

// motion updates resumed
```

### Reactive Timing

VueUse's functions follow Vue's reactivity system defaults for [flush timing](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#effect-flush-timing) where possible.

For `watch`-like composables (e.g. `pausableWatch`, `when`, `useStorage`, `useRefHistory`) the default is `{ flush: 'pre' }`. Which means they will buffer invalidated effects and flush them asynchronously. This avoids unnecessary duplicate invocation when there are multiple state mutations happening in the same "tick".

In the same way as with `watch`, VueUse allows you to configure the timing by passing the `flush` option:

```ts
const { pause, resume } = pausableWatch(
  () => {
    // Safely access updated DOM
  },
  { flush: 'post' }
)
```

**flush option (default: `'pre'`)**
- `'pre'`: buffers invalidated effects in the same 'tick' and flushes them before rendering
- `'post'`: async like 'pre' but fires after component updates so you can access the updated DOM
- `'sync'`: forces the effect to always trigger synchronously

**Note:** For `computed`-like composables (e.g. `syncRef`, `controlledComputed`), when flush timing is configurable, the default is changed to `{ flush: 'sync' }` to align them with the way computed refs works in Vue.

### Configurable Global Dependencies

From v4.0, functions that access the browser APIs will provide an option fields for you to specify the global dependencies (e.g. `window`, `document` and `navigator`). It will use the global instance by default, so for most of the time, you don't need to worry about it. This configure is useful when working with iframes and testing environments.

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
