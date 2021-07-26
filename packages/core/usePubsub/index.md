---
category: Utilities
---

# usePubsub

Has basic publish and subscribe functions.

## Usage

```ts
import { usePubsub } from '@vueuse/core'

const { subscribe, publish, unsubscribe } = usePubsub('vue-use-pubsub')

// subscribe message, return subToken
const subToken = subscribe((message) => {
  console.log(`message: ${message}`)
})
// publish message
publish('The Tokyo Olympics has begun')
// console >> message: The Tokyo Olympics has begun

// Unsubscribe from all subscriptions currently subscribed using usePubsub
// If in setup, it will be called automatically when onUnmounted
unsubscribe()

// All methods to unsubscribe the event name 'vue-use-pubsub'
unsubscribe('vue-use-pubsub')

// Use subToken to cancel a subscribe
unsubscribe(subToken)
```
