---
category: Component
---

# tryOnScopeDispose

Safe `onScopeDispose`. Call `onScopeDispose()` if it's inside an effect scope lifecycle, if not, do nothing

## Usage

```ts
import { tryOnScopeDispose } from '@vueuse/core'

tryOnScopeDispose(() => {

})
```
