---
category: Browser
---

# useCssVar

Manipulate CSS variables

## Usage

```js
import { useCssVar } from '@vueuse/core'

const el = ref(null)
const color = useCssVar('--color', el)

const elv = ref(null)
const key = ref('--color')
const colorVal = useCssVar(key, elv)
```
