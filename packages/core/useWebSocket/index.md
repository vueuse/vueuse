---
category: Network
---

# useWebSocket

Reactive [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client.

## Usage

```ts
import { useWebSocket } from '@vueuse/core'

const { status, data, send, open, close } = useWebSocket('ws://websocketurl')
```

See the [Type Declarations](#type-declarations) for more options.

### immediate

Enable by default.

Establish the connection immediately when the composable is called.

### autoConnect

Enable by default.

If a URL is provided as a ref, when the URL changes, it will automatically reconnect to the new URL.

### autoClose

Enable by default.

This will call `close()` automatically when the `beforeunload` event is triggered or the associated effect scope is stopped.

### autoReconnect

Reconnect on errors automatically (disabled by default).

```ts
import { useWebSocket } from '@vueuse/core'
// ---cut---
const { status, data, close } = useWebSocket('ws://websocketurl', {
  autoReconnect: true,
})
```

Or with more controls over its behavior:

```ts
import { useWebSocket } from '@vueuse/core'
// ---cut---
const { status, data, close } = useWebSocket('ws://websocketurl', {
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      alert('Failed to connect WebSocket after 3 retries')
    },
  },
})
```

You can also pass a function to `delay` to calculate the delay based on the number of retries. This is useful for implementing exponential backoff:

```ts
import { useWebSocket } from '@vueuse/core'
// ---cut---
const { status, data, close } = useWebSocket('ws://websocketurl', {
  autoReconnect: {
    retries: 5,
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    delay: retries => Math.min(1000 * 2 ** (retries - 1), 30000),
  },
})
```

```ts
import { useWebSocket } from '@vueuse/core'
// ---cut---
const { status, data, close } = useWebSocket('ws://websocketurl', {
  autoReconnect: {
    retries: 5,
    // Linear backoff: 1s, 2s, 3s, 4s, 5s
    delay: retries => retries * 1000,
  },
})
```

Explicitly calling `close()` won't trigger the auto reconnection.

### heartbeat

It's common practice to send a small message (heartbeat) for every given time passed to keep the connection active. In this function we provide a convenient helper to do it:

```ts
import { useWebSocket } from '@vueuse/core'
// ---cut---
const { status, data, close } = useWebSocket('ws://websocketurl', {
  heartbeat: true,
})
```

Or with more controls:

```ts
import { useWebSocket } from '@vueuse/core'
// ---cut---
const { status, data, close } = useWebSocket('ws://websocketurl', {
  heartbeat: {
    message: 'ping',
    interval: 1000,
    pongTimeout: 1000,
  },
})
```

### Sub-protocols

List of one or more subprotocols to use, in this case SOAP and WAMP.

```ts
import { useWebSocket } from '@vueuse/core'
// ---cut---
const { status, data, send, open, close } = useWebSocket('ws://websocketurl', {
  protocols: ['soap'], // ['soap', 'wamp']
})
```
