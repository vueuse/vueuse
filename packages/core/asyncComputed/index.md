# asyncComputed

> Like [computed refs](https://composition-api.vuejs.org/api.html#computed), but with support for promises.

## Usage

```js
import { ref } from 'vue-demi'
import { asyncComputed } from '@vueuse/core'

export default {
  template: `
    <p>
      Package: <input v-model="packageName"><br>
      Weekly Downloads: {{ isFetchingDownloads ? 'fetching...' : downloads }}
    </p>
  `,
  setup() {
    const packageName = ref('vueuse')
    const [downloads, isFetchingDownloads] = asyncComputed((onCancel) => {
      const abortController = new AbortController()

      onCancel(() => {
        abortController.abort()
      })

      return fetch(`https://api.npmjs.org/downloads/point/last-week/${packageName.value}`, {
        signal: abortController.signal,
      })
        .then(response => response.json())
        .then(result => result.downloads)
    })

    return { packageName, downloads, isFetchingDownloads }
  },
}
```

## Caveats

- Just like Vue's built-in `computed` function, `useAsyncComputed` does dependency tracking and is automatically re-evaluated when dependencies change.

  Note however that only dependency referenced in the first call stack are considered for this. In other words: Dependencies which are accessed asynchronously are not triggering re-evaluation of the async computed value.
- As opposed to Vue's built-in `computed` function, re-evaluation of the async computed value is triggered whenever dependencies are changing, regardless whether its result is currently being tracked or not.
