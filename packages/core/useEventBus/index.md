---
category: Utilities
---

# useEventBus

A basic event bus.

## Usage

```ts
import { useEventBus } from '@vueuse/core'

const bus = useEventBus<string>('news')

const listener = (event: string) => {
  console.log(`news: ${event}`)
}

// listen to an event
const unsubscribe = bus.on(listener)

// fire an event
bus.emit('The Tokyo Olympics has begun')

// unregister the listener
unsubscribe()
// or
bus.off(listener)

// clearing all listeners
bus.reset()
```

Listeners registered inside of components `setup` will be unregistered automatically when the component gets unmounted.

## TypeScript

Using `EventBusKey` is the key to bind the event type to the key, similar to Vue's [`InjectionKey`](https://antfu.me/notes#typed-provide-and-inject-in-vue) util.

```ts
// fooKey.ts
import type { EventBusKey } from '@vueuse/core'

export const fooKey: EventBusKey<{ name: foo }> = Symbol()
```

```ts
import { useEventBus } from '@vueuse/core'

import { fooKey } from './fooKey'

const bus = useEventBus(fooEventKey)

bus.on((e) => {
  // `e` will be `{ name: foo }`
})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare type EventBusListener<T = unknown> = (event: T) => void
export declare type EventBusEvents<T> = EventBusListener<T>[]
export interface EventBusKey<T> extends Symbol {}
export declare type EventBusIdentifer<T = unknown> =
  | EventBusKey<T>
  | string
  | number
export interface UseEventBusReturn<T> {
  /**
   * Subscribe to an event. When calling emit, the listeners will execute.
   * @param listener watch listener.
   * @returns a stop function to remove the current callback.
   */
  on: (listener: EventBusListener<T>) => Fn
  /**
   * Emit an event, the corresponding event listeners will execute.
   * @param event data sent.
   */
  emit: (event?: T) => void
  /**
   * Remove the corresponding listener.
   * @param listener watch listener.
   */
  off: (listener: EventBusListener<T>) => void
  /**
   * Clear all events
   */
  reset: () => void
}
export declare function useEventBus<T = unknown>(
  key: EventBusIdentifer<T>
): UseEventBusReturn<T>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useEventBus/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useEventBus/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useEventBus/index.md)


<!--FOOTER_ENDS-->
