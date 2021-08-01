---
category: Utilities
---

# useEventBus

This is a basic event bus, which is generally used to transfer data across components.

## Usage

```ts
import { useEventBus } from '@vueuse/core'

const bus = useEventBus('news')

// listen to an event
const off = bus.on((event) => {
  console.log(`news: ${event}`)
})

// fire an event
bus.emit('The Tokyo Olympics has begun')

// use return callback to cancel a listener
off()

// off from all subscriptions currently on using useEventBus
// if in setup, it will be called automatically when onUnmounted
bus.off()

// all methods to off the event name 'news'
bus.off('news')

// clearing all events
bus.all.clear()

// working with handler references:
function onFoo() {}
bus.on(onFoo)   // listen
bus.off(onFoo)  // unlisten
```

## TypeScript

Using EventBusKey is the key to save the event type, similar to vue's InjectionKey util.

```ts
import { useEventBus, EventBusKey } from '@vueuse/core'

const fooKey: EventBusKey<{ name: foo }> = Symbol()

const bus = useEventBus(fooEventKey)

bus.on((e) => {
	// `e` will be `{ name: foo }`
})
```