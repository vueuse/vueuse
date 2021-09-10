---
category: Browser
---

# useUrlSearchParams

Reactive [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

## Usage

```html {14}
<template>
  <ul>
    <li v-for="key in Object.keys(params)" :key="key">
      {{ key }}={{ params[key] }}
    </li>
  </ul>
</template>

<script>
import { useUrlSearchParams } from '@vueuse/core'

export default {
  setup() {
    const params = useUrlSearchParams('history')
    params.foo = 'bar'
    params.vueuse = 'awesome'
    return { params }
  } 
}
</script>
```
