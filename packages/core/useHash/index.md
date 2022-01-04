# useHash

Reactive Location Hash which reactively binds the window.location.hash to a Vue ref.

## Usage

```ts
import { useHash } from '@vueuse/core'

const { hash, setHash } = useHash()

// Use the setHash wrapper function
setHash('#section-1')
```
