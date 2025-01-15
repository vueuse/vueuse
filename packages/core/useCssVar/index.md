---
category: Browser
---

# useCssVar

Manipulate CSS variables

## Usage

```js
import { useTemplateRef } from 'vue'
import { useCssVar } from '@vueuse/core'

const el = useTemplateRef('el')
const color1 = useCssVar('--color', el)

const elv = useTemplateRef('elv')
const key = ref('--color')
const colorVal = useCssVar(key, elv)

const someEl = useTemplateRef('someEl')
const color2 = useCssVar('--color', someEl, { initialValue: '#eee' })
```
