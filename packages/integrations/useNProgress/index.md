# useNProgress

> Reactive wrapper for [`nprogress`](https://github.com/rstacruz/nprogress)

## Usage

```js {6}
import { useNProgress } from '@vueuse/integrations'

const { isLoading } = useNProgress()

function toggle() {
  isLoading.value = !isLoading.value
}
```

### Passing a source ref

You can pass a `ref` to it, changes from of the source ref will be reflected to your loading progress.

```js {4}
import { ref } from 'vue'
import { useNProgress } from '@vueuse/integrations'

const isLoading = ref(false)

useNProgress(isLoading)

function toggle() {
  isLoading.value = !isLoading.value
}
```

### Customization

Just edit [nprogress.css](http://ricostacruz.com/nprogress/nprogress.css) to your liking. Tip: you probably only want to find and replace occurrences of #29d.
