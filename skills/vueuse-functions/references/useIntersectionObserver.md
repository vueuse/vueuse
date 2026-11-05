---
category: Elements
---

# useIntersectionObserver

Detects changes to a target element's visibility.

## Usage

```vue
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const target = useTemplateRef('target')
const targetIsVisible = shallowRef(false)

const { stop } = useIntersectionObserver(
  target,
  ([entry], observerElement) => {
    targetIsVisible.value = entry?.isIntersecting || false
  },
)
</script>

<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>
</template>
```

### Controls and cleanup

`useIntersectionObserver` returns controls for the underlying observer:

| State         | Type                   | Description                                                                           |
| ------------- | ---------------------- | ------------------------------------------------------------------------------------- |
| `isSupported` | `ComputedRef<boolean>` | Whether the `IntersectionObserver` API is available.                                  |
| `isActive`    | `ShallowRef<boolean>`  | Whether the observer is currently running. Turns `false` after `pause()` or `stop()`. |
| `pause`       | `() => void`           | Pause observing and set `isActive` to `false`.                                        |
| `resume`      | `() => void`           | Resume observing.                                                                     |
| `stop`        | `() => void`           | Stop observing permanently.                                                           |

The observer is disconnected automatically via [`tryOnScopeDispose`](https://vueuse.org/shared/tryOnScopeDispose/) when the component or effect scope that created it is disposed, so in most cases you don't need to call `stop` yourself. Call `stop()` to disconnect the observer earlier, for example once the element has become visible:

```ts
import { useIntersectionObserver } from '@vueuse/core'
// ---cut---
const { stop } = useIntersectionObserver(
  target,
  ([entry]) => {
    if (entry?.isIntersecting) {
      // react to the element becoming visible once, then stop observing
      stop()
    }
  },
)
```

## Directive Usage

```vue
<script setup lang="ts">
import { vIntersectionObserver } from '@vueuse/components'
import { shallowRef, useTemplateRef } from 'vue'

const root = useTemplateRef('root')

const isVisible = shallowRef(false)

function onIntersectionObserver([entry]: IntersectionObserverEntry[]) {
  isVisible.value = entry?.isIntersecting || false
}
</script>

<template>
  <div>
    <p>
      Scroll me down!
    </p>
    <div v-intersection-observer="onIntersectionObserver">
      <p>Hello world!</p>
    </div>
  </div>

  <!-- with options -->
  <div ref="root">
    <p>
      Scroll me down!
    </p>
    <div v-intersection-observer="[onIntersectionObserver, { root }]">
      <p>Hello world!</p>
    </div>
  </div>
</template>
```

[IntersectionObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)

## Type Declarations

```ts
export interface UseIntersectionObserverOptions extends ConfigurableWindow {
  /**
   * Start the IntersectionObserver immediately on creation
   *
   * @default true
   */
  immediate?: boolean
  /**
   * The Element or Document whose bounds are used as the bounding box when testing for intersection.
   */
  root?: MaybeComputedElementRef | Document
  /**
   * A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections.
   */
  rootMargin?: MaybeRefOrGetter<string>
  /**
   * Either a single number or an array of numbers between 0.0 and 1.
   * @default 0
   */
  threshold?: number | number[]
}
export interface UseIntersectionObserverReturn extends Supportable, Pausable {
  stop: () => void
}
/**
 * Detects changes to a target element's visibility.
 *
 * @see https://vueuse.org/useIntersectionObserver
 * @param target
 * @param callback
 * @param options
 */
export declare function useIntersectionObserver(
  target: MaybeComputedElementRefOrArray,
  callback: IntersectionObserverCallback,
  options?: UseIntersectionObserverOptions,
): UseIntersectionObserverReturn
```
