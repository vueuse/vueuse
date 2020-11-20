# useNProgress

> Reactive wrapper for [`nprogress`](https://github.com/rstacruz/nprogress)

## Usage

```js {6}
import { useNProgress } from '@vueuse/integrations'

const loading = useNProgress()

function toggle() {
  loading.value = !loading.value
}
```

### Passing a source ref

You can pass a `ref` to it, changes from of the source ref will be reflected to your loading progress.

```js {4}
import { ref } from 'vue'
import { useNProgress } from '@vueuse/integrations'

const loading = ref(false)

useNProgress(loading)

function toggle() {
  loading.value = !loading.value
}
```


