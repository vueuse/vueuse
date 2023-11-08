---
category: State
---

# injectLocal

Extended `inject` with ability to call `provideLocal` to provide the value in the same component.

## Usage

```vue
<script setup>
import { injectLocal, provideLocal } from '@vueuse/core'

provideLocal('MyInjectionKey', 1)
const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
</script>
```
