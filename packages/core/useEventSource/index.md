---
category: Network
---

# useEventSource

An [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) or [Server-Sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) instance opens a persistent connection to an HTTP server, which sends events in text/event-stream format.

## Usage

```js
import { useEventSource } from '@vueuse/core'

const { status, data, error, close } = useEventSource('https://event-source-url')
```

See the [Type Declarations](#type-declarations) for more options.

### Named Events

You can define named events with the second parameter

```js
import { useEventSource } from '@vueuse/core'

const { event, data } = useEventSource('https://event-source-url', ['notice', 'update'] as const)
```

### Immediate

Auto-connect (enabled by default).

This will call `open()` automatically for you and you don't need to call it by yourself.

If url is provided as a ref, this also controls whether a connection is re-established when its value is changed (or whether you need to call open() again for the change to take effect).

### Auto-reconnection

Reconnect on errors automatically (disabled by default).

```js
const { status, data, close } = useEventSource('https://event-source-url', [], {
  autoReconnect: true,
})
```

Or with more controls over its behavior:

```js
const { status, data, close } = useEventSource('https://event-source-url', [], {
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      alert('Failed to connect EventSource after 3 retries')
    },
  },
})
```
