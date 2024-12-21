---
category: Reactivity
alias: resetRef
---

# refReset

A ref which can be reset to the default value.

## Usage

> Please note the `reset` method will not be accessible in Vue's template.

```ts
import { refReset } from '@vueuse/core'

const form = refReset(() => ({ name: '' }))

function setName() {
  form.value.name = 'Hulk'
}

function resetForm() {
  form.reset()
}
```
