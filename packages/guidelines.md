# Guidelines

Here are the guidelines for VueUse functions. You could also take them as a reference for authoring your own composable functions or apps.

You can also find some reasons for those design decisions and also some tips for writing composable functions with [Anthony Fu](https://github.com/antfu)'s talk about VueUse:

- [Composable Vue](https://antfu.me/posts/composable-vue-vueday-2021) - at VueDay 2021
- [可组合的 Vue](https://antfu.me/posts/composable-vue-vueconf-china-2021) - at VueConf China 2021 (in Chinese)

## General

- Import all Vue APIs from `"vue-demi"`
- Use `ref` instead `reactive` whenever possible
- Use options object as arguments whenever possible to be more flexible for future extensions.
- Use `shallowRef` instead of `ref` when wrapping large amounts of data.
- Use `configurableWindow` (etc.) when using global variables like `window` to be flexible when working with multi-windows, testing mocks, and SSR.
- When involved with Web APIs that are not yet implemented by the browser widely, also outputs `isSupported` flag
- When using `watch` or `watchEffect` internally, also make the `immediate` and `flush` options configurable whenever possible
- Use `tryOnUnmounted`  to clear the side-effects gracefully
- Avoid using console logs
- When the function is asynchronous, return a PromiseLike

Read also: [Best Practice](./guide/best-practice.md)

## ShallowRef

Use `shallowRef` instead of `ref` when wrapping large amounts of data.

```ts
export function useFetch<T>(url: MaybeRef<string>) {
  // use `shallowRef` to prevent deep reactivity
  const data = shallowRef<T | undefined>()
  const error = shallowRef<Error | undefined>()

  fetch(unref(url))
    .then(r => r.json())
    .then(r => data.value = r)
    .catch(e => error.value = e)

  /* ... */
}
```

## Configurable Globals

When using global variables like `window` or `document`, support `configurableWindow` or `configurableDocument` in the options interface to make the function flexible when for scenarios like multi-windows, testing mocks, and SSR.

Learn more about the implementation: [`_configurable.ts`](https://github.com/vueuse/vueuse/blob/main/packages/core/_configurable.ts)

```ts
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export function useActiveElement<T extends HTMLElement>(
  options: ConfigurableWindow = {},
) {
  const {
    // defaultWindow = isClient ? window : undefined
    window = defaultWindow,
  } = options

  let el: T

  // skip when in Node.js environment (SSR)
  if (window) {
    window.addEventListener('blur', () => {
      el = window?.document.activeElement
    }, true)
  }

  /* ... */
}
```

Usage example:

```ts
// in iframe and bind to the parent window
useActiveElement({ window: window.parent })
```

## Watch Options

When using `watch` or `watchEffect` internally, also make the `immediate` and `flush` options configurable whenever possible. For example `watchDebounced`:

```ts
import type { WatchOptions } from 'vue-demi'

// extend the watch options
export interface WatchDebouncedOptions extends WatchOptions {
  debounce?: number
}

export function watchDebounced(
  source: any,
  cb: any,
  options: WatchDebouncedOptions = {},
): WatchStopHandle {
  return watch(
    source,
    () => { /* ... */ },
    options, // pass watch options
  )
}
```

## Controls

We use the `controls` option allowing users to use functions with a single return for simple usages, while being able to have more controls and flexibility when needed. Read more: [#362](https://github.com/vueuse/vueuse/pull/362).

#### When to provide a `controls` option

- The function is more commonly used with single `ref` or 
- Examples: `useTimestamp`, `useInterval`,

```ts
// common usage
const timestamp = useTimestamp()

// more controls for flexibility
const { timestamp, pause, resume } = useTimestamp({ controls: true })
```

Refer to `useTimestamp`'s source code for the implementation of proper TypeScript support.

#### When **NOT** to provide a `controls` option

- The function is more commonly used with multiple returns
- Examples: `useRafFn`, `useRefHistory`,

```ts
const { pause, resume } = useRafFn(() => {})
```

## `isSupported` Flag

When involved with Web APIs that are not yet implemented by the browser widely, also outputs `isSupported` flag.

For example `useShare`:

```ts
export function useShare(
  shareOptions: MaybeRef<ShareOptions> = {},
  options: ConfigurableNavigator = {},
) {
  const { navigator = defaultNavigator } = options
  const isSupported = useSupported(() => navigator && 'canShare' in navigator)

  const share = async (overrideOptions) => {
    if (isSupported.value) {
      /* ...implementation */
    }
  }

  return {
    isSupported,
    share,
  }
}
```

## Asynchronous Composables

When a composable is asynchronous, like `useFetch`, it is a good idea to return a PromiseLike object from the composable
so the user is able to await the function. This is especially useful in the case of Vue's `<Suspense>` api.

- Use a `ref` to determine when the function should resolve e.g. `isFinished`
- Store the return state in a variable as it must be returned twice, once in the return and once in the promise.
- The return type should be an intersection between the return type and a PromiseLike, e.g. `UseFetchReturn & PromiseLike<UseFetchReturn>`

```ts
export function useFetch<T>(url: MaybeRef<string>): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>> {
  const data = shallowRef<T | undefined>()
  const error = shallowRef<Error | undefined>()
  const isFinished = ref(false)

  fetch(unref(url))
    .then(r => r.json())
    .then(r => data.value = r)
    .catch(e => error.value = e)
    .finally(() => isFinished.value = true)

  // Store the return state in a variable
  const state: UseFetchReturn<T> = {
    data,
    error,
    isFinished,
  }

  return {
    ...state,
    // Adding `then` to an object allows it to be awaited.
    then(onFulfilled, onRejected) {
      return new Promise<UseFetchReturn<T>>((resolve, reject) => {
        until(isFinished)
          .toBeTruthy()
          .then(() => resolve(state))
          .then(() => reject(state))
      }).then(onFulfilled, onRejected)
    },
  }
}
```


## Renderless Components

- Use render functions instead of Vue SFC
- Wrap the props in `reactive` to easily pass them as props to the slot
- Prefer to use the functions options as prop types instead of recreating them yourself
- Only wrap the slot in an HTML element if the function needs a target to bind to

```ts
import { defineComponent, reactive } from 'vue-demi'
import type { MouseOptions } from '@vueuse/core'
import { useMouse } from '@vueuse/core'

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

Sometimes a function may have multiple parameters, in that case, you maybe need to create a new interface to merge all the interfaces
into a single interface for the component props.

```ts
import type { TimeAgoOptions } from '@vueuse/core'
import { useTimeAgo } from '@vueuse/core'

interface UseTimeAgoComponentOptions extends Omit<TimeAgoOptions<true>, 'controls'> {
  time: MaybeRef<Date | number | string>
}

export const UseTimeAgo = defineComponent<UseTimeAgoComponentOptions>({ /* ... */ })
```
