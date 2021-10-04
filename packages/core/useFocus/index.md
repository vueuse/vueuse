---
category: Sensors
---

# useFocus

Utility to track or set the focus state of a DOM element.

## Usage

```ts
import { useFocus } from '@vueuse/core'

const text = ref();
const textFocused = useFocus({ target: text })
```
