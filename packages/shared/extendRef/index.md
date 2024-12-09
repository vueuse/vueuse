---
category: Reactivity
---

# extendRef

Add extra attributes to Ref.

## Usage

> Please note the extra attribute will not be accessible in Vue's template.

```ts
import { extendRef } from '@vueuse/core'
import { ref } from 'vue'

const myRef = ref('content')

const extended = extendRef(myRef, { foo: 'extra data' })

extended.value === 'content'
extended.foo === 'extra data'
```

Refs will be unwrapped and be reactive

```ts
const myRef = ref('content')
const extraRef = ref('extra')

const extended = extendRef(myRef, { extra: extraRef })

extended.value === 'content'
extended.extra === 'extra'

extended.extra = 'new data' // will trigger update
extraRef.value === 'new data'
```
