# useUrlSearchParams

> Reactive [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

## Usage

```html {19}
<template>
  <ul>
    <li v-for='key in Object.keys(params)'>{{ key }}={{ params[key] }}</li>
  </ul>
</template>

<script>
import { useUrlSearchParams } from '@vueuse/core'

export default {
  setup() {
    const params = useUrlSearchParams('history')
    params.foo = 'bar'
    return { params }
  } 
}
</script>
```
