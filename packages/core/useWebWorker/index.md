---
category: Misc
---

# useWebWorker

> Simple [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) registration and communication.


## Related Functions

Try out the high-level `useWebWorkerFn`

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


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Simple Web Workers registration and communication.
 *
 * @see   {@link https://vueuse.js.org/useWebWorker}
 * @param url
 */
export declare function useWebWorker(
  url: string
): {
  data: Ref<any>
  post: {
    (message: any, transfer: Transferable[]): void
    (message: any, options?: PostMessageOptions | undefined): void
  }
  terminate: () => void
}
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useWebWorker/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useWebWorker/index.md)


<!--FOOTER_ENDS-->