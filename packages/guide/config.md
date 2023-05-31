# Configurations

These show the general configurations for most of the functions in VueUse.

### Event Filters

From v4.0, we provide the Event Filters system to give the flexibility to control when events will get triggered. For example, you can use `throttleFilter` and `debounceFilter` to control the event trigger rate:

```ts
import { debounceFilter, throttleFilter, useLocalStorage, useMouse } from '@vueuse/core'

// changes will write to localStorage with a throttled 1s
const storage = useLocalStorage('my-key', { foo: 'bar' }, { eventFilter: throttleFilter(1000) })

// mouse position will be updated after mouse idle for 100ms
const { x, y } = useMouse({ eventFilter: debounceFilter(100) })
```

Moreover, you can utilize `pausableFilter` to temporarily pause some events.

```ts
import { pausableFilter, useDeviceMotion } from '@vueuse/core'

const motionControl = pausableFilter()

const motion = useDeviceMotion({ eventFilter: motionControl.eventFilter })

motionControl.pause()

// motion updates paused

motionControl.resume()

// motion updates resumed
```

### Reactive Timing

VueUse's functions follow Vue's reactivity system defaults for [flush timing](https://vuejs.org/guide/essentials/watchers.html#callback-flush-timing) where possible.

For `watch`-like composables (e.g. `pausableWatch`, `whenever`, `useStorage`, `useRefHistory`) the default is `{ flush: 'pre' }`. Which means they will buffer invalidated effects and flush them asynchronously. This avoids unnecessary duplicate invocation when there are multiple state mutations happening in the same "tick".

In the same way as with `watch`, VueUse allows you to configure the timing by passing the `flush` option:

```ts
const { pause, resume } = pausableWatch(
  () => {
    // Safely access updated DOM
  },
  { flush: 'post' },
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
const childMousePos = useMouse({ window: iframe.contentWindow })
```

```ts
// testing
const mockWindow = { /* ... */ }

const { x, y } = useMouse({ window: mockWindow })
```
