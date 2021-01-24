---
category: Misc
---

# useWebSocket

Reactive simple [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client.

## Usage

```js
import { useWebSocket } from '@vueuse/core'

const { state, data, send, close, ws } = useWebSocket('ws://websocketurl')
```

| State | Type          | Description                                                                                             |
| ----- | ------------- | ------------------------------------------------------------------------------------------------------- |
| state | `Ref<string>` | The current websocket state, can be only one of: 'OPEN', 'CONNECTING', 'CLOSING', 'CLOSED'              |
| data  | `Ref<object>` | Reference to the latest data received via the websocket, can be watched to respond to incoming messages |

| Method | Signature                                  | Description                                  |
| ------ | ------------------------------------------ | -------------------------------------------- |
| send   | `(data: any) => void`                      | Sends data through the websocket connection. |
| close  | `(code?: number, reason?: string) => void` | Closes the websocket connection gracefully.  |

| Instance | Type                | Description         |
| -------- | ------------------- | ------------------- |
| ws       | `WebSocket<object>` | WebSocket instance. |


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare type WebSocketStatus =
  | "OPEN"
  | "CONNECTING"
  | "CLOSING"
  | "CLOSED"
/**
 * Reactive simple WebSocket client.
 *
 * @see   {@link https://vueuse.js.org/useWebSocket}
 * @param url
 */
export declare function useWebSocket(
  url: string
): {
  data: Ref<any>
  state: Ref<WebSocketStatus>
  close: (code?: number | undefined, reason?: string | undefined) => void
  send: (
    data: string | Blob | ArrayBuffer | SharedArrayBuffer | ArrayBufferView
  ) => void
  ws: WebSocket
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/useWebSocket/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/useWebSocket/index.md)


<!--FOOTER_ENDS-->
