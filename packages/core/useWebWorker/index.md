# useWebWorker

> Simple [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) registration and communication.


## Related Functions

Try out our higher level [useWebWorkerFn](https://vueuse.js.org/?path=/story/misc--usewebworkerfn).

## Usage

```js
import { useWebWorker } from 'vue-use-web'

const { data, post, terminate } = useWebWorker('/path/to/worker.js')
```

| State | Type       | Description                                                                                          |
| ----- | ---------- | ---------------------------------------------------------------------------------------------------- |
| data  | `Ref<any>` | Reference to the latest data received via the worker, can be watched to respond to incoming messages |


| Method    | Signature             | Description                      |
| --------- | --------------------- | -------------------------------- |
| post      | `(data: any) => void` | Sends data to the worker thread. |
| terminate | `() => void`          | Stops and terminates the worker. |
