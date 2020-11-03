# syncRef

> Keep target refs in sync with a source ref

## Usage

```ts
import { syncRef } from '@vueuse/core'

const source = ref('hello')
const target = ref('target')

const stop = syncRef(source, target)

console.log(target.value) // hello

source.value = 'foo'

console.log(target.value) // foo
```
