---
category: Browser
---

# useBroadcastChannel

Reactive [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel). 

Closes a broadcast channel automatically component unmounted.

## Usage

The BroadcastChannel interface represents a named channel that any browsing 
context of a given origin can subscribe to. It allows communication between 
different documents (in different windows, tabs, frames, or iframes) of the 
same origin. 

Messages are broadcasted via a message event fired at all BroadcastChannel 
objects listening to the channel.

```js
import { ref } from 'vue'
import { useBroadcastChannel } from '@vueuse/core'

const {
  isSupported,
  channel,
  post,
  close,
  error,
  isClosed,
} = useBroadcastChannel({ name: 'vueuse-demo-channel' })

const message = ref('')

message.value = 'Hello, VueUse World!'

// Post the message to the broadcast channel:
post(message.value)

// Option to close the channel if you wish:
close()
```
