# reactifyObject

> Apply `reactify` to an object

## Usage

```ts
import { reactifyObject } from '@vueuse/core'

const console = reactifyObject(console)

const a = ref('42')

console.log(a) // no longer need `.value`
```
