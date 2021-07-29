---
category: Utilities
---

# useEventBus

This is a basic event bus, which is generally used to transfer data across components.

## Usage

```ts
import { useEventBus } from '@vueuse/core'

const event = useEventBus('news')

// use event.on | event.once, listen 'news' event,
// incoming listener to get message, return unToken.
const unToken = event.on((message) => {
  console.log(`message: ${message}`)
})

// emit 'news' event message
event.emit('The Tokyo Olympics has begun')
// console >> message: The Tokyo Olympics has begun

// off from all subscriptions currently on using useEventBus
// if in setup, it will be called automatically when onUnmounted
event.off()

// all methods to off the event name 'news'
event.off('event-bus')

// use subToken to cancel a listener
event.off(subToken)
```
