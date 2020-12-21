# useUrlSearchParams

> Reactive [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

## Usage

```html {19}
<template>
  <ul>
    <li v-for='[key, value] in params'>{{ key }}={{ value }}</li>
  </ul>
</template>

<script>
import { useUrlSearchParams } from '@vueuse/core'

export default {
  setup() {
    const params = useUrlSearchParams('history')
    params.value.set('foo', 'bar')
    return { params } 
  } 
}
</script>
```
