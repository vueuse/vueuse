# useRetry

Retry something until fulfilled.

## Usage

```ts
import { useFetch, useRetry } from '@vueuse/core'

const { statusCode: finalStatusCode } = await useRetry(
  () => useFetch('https://example.com/api/users'),
  ({ statusCode }) => {
    return statusCode.value != null && statusCode.value >= 200 && statusCode.value < 300
  },
  { interval: 100, timeout: 1000 },
)
```
