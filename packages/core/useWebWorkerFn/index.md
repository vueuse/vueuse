# useWebWorkerFn

> Run expensive function without blocking the UI, using a simple syntax that makes use of Promise. A port of [alewin/useWorker](https://github.com/alewin/useWorker).


## Usage

### Basic example

```js
import { useWebWorkerFn } from '@vueuse/core'

const { workerFn } = useWebWorkerFn(() => {
  // some heavy works to do in web worker
})
```

### With dependencies

```ts {7-9}
import { useWebWorkerFn } from '@vueuse/core'

const { workerFn, workerStatus, workerTerminate } = useWebWorkerFn(
  dates => dates.sort(dateFns.compareAsc), 
  {
    timeout: 50000, // 5 seconds
    dependencies: [
      'https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.js' // dateFns
    ],
  }
)
```

## Web Worker

Before you start using this function, we suggest you read the [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) documentation.

## API

### Parameters

| Name            | Type             | Description                                                |
| --------------- | ---------------- | ---------------------------------------------------------- |
| fn              | Function         | The `pure function` to run with web workers                |
| options         | Object           | The object containing the options of the worker            |

### Options

| Name         | Type            | Default   | Description                                                               |
| ------------ | --------------- | --------- | ------------------------------------------------------------------------- |
| timeout      | Number          | undefined | the number of milliseconds before killing the worker                      |
| dependencies | Array of String | []        | an array that contains the external dependencies needed to run the worker |


### Return Value

| Name            | Type             | Description                                                |
| --------------- | ---------------- | ---------------------------------------------------------- |
| workerFn        | Promise          | The `function` that allows you to run `fn` with web worker |
| workerStatus    | `WebWorkerStatus`   | The status of `workerFn`                                   |
| workerTerminate | Function         | The function that kills the worker                          |

## Credit

This function is a Vue port of https://github.com/alewin/useWorker by Alessio Koci, with the help of [@Donskelle](https://github.com/Donskelle) to migration.

