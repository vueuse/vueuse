---
category: Browser
---

# useUrlSearchParams

Reactive [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

## Usage

```js
import { useUrlSearchParams } from '@vueuse/core'

const params = useUrlSearchParams('history')

console.log(params.foo) // 'bar'

params.foo = 'bar'
params.vueuse = 'awesome'
// url updated to `?foo=bar&vueuse=awesome`
```

### Hash Mode

When using with hash mode route, specify the `mode` to `hash`

```js
import { useUrlSearchParams } from '@vueuse/core'

const params = useUrlSearchParams('hash')

params.foo = 'bar'
params.vueuse = 'awesome'
// url updated to `#/your/route?foo=bar&vueuse=awesome`
```

### Hash Params

When using with history mode route, but want to use hash as params, specify the `mode` to `hash-params`

```js
import { useUrlSearchParams } from '@vueuse/core'

const params = useUrlSearchParams('hash-params')

params.foo = 'bar'
params.vueuse = 'awesome'
// url updated to `/your/route#foo=bar&vueuse=awesome`
```

### Custom Stringify Function

You can provide a custom function to serialize URL parameters using the `stringify` option. This is useful when you need special formatting for your query string.

```js
import { useUrlSearchParams } from '@vueuse/core'

// Custom stringify function that removes equal signs for empty values
const params = useUrlSearchParams('history', {
  stringify: (params) => {
    return params.toString().replace(/=(&|$)/g, '$1')
  }
})

params.foo = ''
params.bar = 'value'
// url updated to `?foo&bar=value` instead of `?foo=&bar=value`
```
