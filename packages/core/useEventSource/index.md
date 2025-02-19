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

```ts
import { useEventSource } from '@vueuse/core'

const { event, data } = useEventSource('https://event-source-url', ['notice', 'update'] as const)
```

### immediate

Enable by default.

Establish the connection immediately when the composable is called.

### autoConnect

Enable by default.

If url is provided as a ref, when the url changes, it will automatically reconnect to the new url.

### Auto Reconnection on Errors

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
