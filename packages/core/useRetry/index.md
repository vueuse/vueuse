# useRetry

Retry something until fulfilled.

## Usage

```ts
import { useFetch, useRetry } from '@vueuse/core'

const { onFinish } = useRetry(
  () => useFetch('https://example.com/api/users'),
  ({ statusCode }) => statusCode.value != null && statusCode.value >= 200 && statusCode.value < 300,
  { interval: 100, timeout: 1000 },
)

onFinish(({ statusCode }) => {
  console.log(status.code) // 200
})
```
