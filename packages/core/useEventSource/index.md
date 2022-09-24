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

| State | Type          | Description                                                                                             |
| ----- | ------------- | ------------------------------------------------------------------------------------------------------- |
| status | `Ref<string>` | A read-only value representing the state of the connection. Possible values are CONNECTING (0), OPEN (1), or CLOSED (2)|
| data   | `Ref<string \| null>` | Reference to the latest data received via the EventSource, can be watched to respond to incoming messages |
| eventSource | `Ref<EventSource \| null>` | Reference to the current EventSource instance |

| Method | Signature                                  | Description                            |
| ------ | ------------------------------------------ | ---------------------------------------|
| close  | `() => void` | Closes the EventSource connection gracefully.  |
