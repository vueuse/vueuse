---
category: Network
---

# useWebSocket

Reactive [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client.

## Usage

```js
import { useWebSocket } from '@vueuse/core'

const { status, data, send, open, close } = useWebSocket('ws://websocketurl')
```

See the [Type Declarations](#type-declarations) for more options.

### immediate

Enable by default.

Establish the connection immediately when the composable is called.

### autoConnect

Enable by default.

If url is provided as a ref, when the url changes, it will automatically reconnect to the new url.

### autoClose

Enable by default.

This will call `close()` automatically when the `beforeunload` event is triggered or the associated effect scope is stopped.

### autoReconnect

Reconnect on errors automatically (disabled by default).

```js
const { status, data, close } = useWebSocket('ws://websocketurl', {
  autoReconnect: true,
})
```

Or with more controls over its behavior:

```js
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

Explicitly calling `close()` won't trigger the auto reconnection.

### heartbeat

It's common practice to send a small message (heartbeat) for every given time passed to keep the connection active. In this function we provide a convenient helper to do it:

```js
const { status, data, close } = useWebSocket('ws://websocketurl', {
  heartbeat: true,
})
```

Or with more controls:

```js
const { status, data, close } = useWebSocket('ws://websocketurl', {
  heartbeat: {
    message: 'ping',
    interval: 1000,
    pongTimeout: 1000,
  },
})
```

### Sub-protocols

List of one or more subprotocols to use, in this case soap and wamp.

```js
import { useWebSocket } from '@vueuse/core'

const { status, data, send, open, close } = useWebSocket('ws://websocketurl', {
  protocols: ['soap'], // ['soap', 'wamp']
})
```
