---
category: Browser
---

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


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare type UrlParams = Record<string, string[] | string>
/**
 * Reactive URLSearchParams
 *
 * @see   {@link https://vueuse.js.org/useUrlSearchParams}
 * @param mode
 * @param options
 */
export declare function useUrlSearchParams<
  T extends Record<string, any> = UrlParams
>(mode?: "history" | "hash", options?: ConfigurableWindow): T
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useUrlSearchParams/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useUrlSearchParams/index.md)


<!--FOOTER_ENDS-->