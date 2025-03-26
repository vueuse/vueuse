---
category: Reactivity
related: toRef
alias: resolveUnref
deprecated: true
---

# toValue

Get the value of value/ref/getter.

:::warning

Deprecated, use `import { toValue } from 'vue'` instead.

:::

## Usage

```ts
import { toValue } from '@vueuse/core'

const foo = ref('hi')

const a = toValue(0) // 0
const b = toValue(foo) // 'hi'
const c = toValue(() => 'hi') // 'hi'
```
