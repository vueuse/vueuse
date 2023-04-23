# useAsyncLoading

When requesting data from the backend, the page needs to display a "loading" state, which should be hidden when the request is complete. 
However, if the backend data returns too quickly, the "loading" state will flicker and create a poor user experience. 
To avoid this problem, a compromise solution is to not display the "loading" state if the request time is less than 500ms, but to show it for at least 500ms if the request time is greater than 500ms.

Of course, the timing for displaying the loading and its duration can be adjusted according to business needs.

## Usage

```vue
<script setup lang="ts">
import { useAsyncLoading } from '@vueuse/core'

const { asyncLoading, showLoading, hideLoading } = useAsyncLoading()

showLoading()

// some async function
setTimeout(() => {
  hideLoading()
}, 500)
</script>

<template>
  <div>
    <div>
      {{ asyncLoading }}
    </div>
    <!-- if use like `Element-Plus` -->
    <!-- <div v-loading="asyncLoading"></div> -->
  </div>
</template>
```

If you have used a `loading` in your previous project, you can pass it as a default value to `useAsyncLoading`. 
It will automatically update the value of `asyncLoading` when the `loading` changes.
And then replace the `loading` in the template with `asyncLoading`.

```vue
<script setup lang="ts">
import { useAsyncLoading } from '@vueuse/core'

const loading = ref(false)

const { asyncLoading, showLoading, hideLoading } = useAsyncLoading({
  defaultLoading: loading
})

loading.value = true

// some async function
setTimeout(() => {
  loading.value = false
}, 500)
</script>

<template>
  <div>
    <div>
      {{ loading }} / {{ asyncLoading }}
    </div>
    <!-- if use like `Element-Plus` -->
    <!-- <div v-loading="asyncLoading"></div> -->
  </div>
</template>
```
