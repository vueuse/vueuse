---
category: Utilities
---

# useEventBus

This is a basic event bus, which is generally used to transfer data across components.

## Usage

```ts
import { useEventBus } from '@vueuse/core'

const bus = useEventBus('news')

// use bus.on | bus.once, listen 'news' event,
// incoming listener to get message, return unToken.
const off = bus.on((event) => {
  console.log(`news: ${event}`)
})

// emit 'news' event message
bus.emit('The Tokyo Olympics has begun')
// console >> news: 'The Tokyo Olympics has begun'

// off from all subscriptions currently on using useEventBus
// if in setup, it will be called automatically when onUnmounted
bus.off()

// all methods to off the event name 'news'
bus.off('news')

// use return callback to cancel a listener
off()
```
