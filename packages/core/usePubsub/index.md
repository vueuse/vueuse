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

// All methods to unsubscribe the event name 'vue-use-pubsub'
unsubscribe()

// All methods to unsubscribe the event name 'vue-use-pubsub-2'
unsubscribe('vue-use-pubsub-2')

// Use subToken to cancel a subscribe
unsubscribe(subToken)

// Or wait for the page to be called up in Unmounted, 
// the subscribers appearing on the current page will be uninstalled automatically
```
