# useWebSocket

> Reactive simple [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) client.

## Usage

```js
import { useWebSocket } from '@vueuse/core'

const { state, data, send, close } = useWebSocket('ws://websocketurl')
```

| State | Type          | Description                                                                                             |
| ----- | ------------- | ------------------------------------------------------------------------------------------------------- |
| state | `Ref<string>` | The current websocket state, can be only one of: 'OPEN', 'CONNECTING', 'CLOSING', 'CLOSED'              |
| data  | `Ref<object>` | Reference to the latest data received via the websocket, can be watched to respond to incoming messages |

| Method | Signature                                  | Description                                  |
| ------ | ------------------------------------------ | -------------------------------------------- |
| send   | `(data: any) => void`                      | Sends data through the websocket connection. |
| close  | `(code?: number, reason?: string) => void` | Closes the websocket connection gracefully.  |
