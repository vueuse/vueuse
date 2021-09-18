---
category: Utilities
---

# useRandomString

Primitive random string generation. Great for coupling with label/inputs or use in aria related complex couplings. 

__You can also specify:__ 

- String prefix
- Character length

## Usage

```ts
import { useRandomString } from '@vueuse/core'
const { randomString, generateRandomString } = useRandomString()
```

```vue
<div class="field">
  <label for="randomString">Some label</label>
  <input id="randomString" value="Vue is great"/>
</div>
```
