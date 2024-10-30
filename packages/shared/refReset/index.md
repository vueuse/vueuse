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
  form.reset() // -> { name: '' }
}
```

You can also pass a 2nd parameter `true` to reset the value if nullish value is set

```ts
import { refReset } from '@vueuse/core'

const form = refReset(() => ({ name: '' }), true)

function setName() {
  form.value.name = 'Hulk'
}

function resetForm() {
  form.value = undefined! // -> { name: '' }
}
```

> Please note, in this case you must use a non-null assertion when assigning an undefined value, because in terms of types the value cannot be `null`/`undefined`.
