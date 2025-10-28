---
category: Time
---

# useBirthFormatter

A sample birth date formatter. Use it to format user-entered birth dates in year-month-day order, with a custom separator.

## Usage

```ts
import type { Ref } from 'vue'
import { useBirthFormatter } from '@vueuse/core'
import { shallowRef } from 'vue'

const inputVal = shallowRef('')
```

```vue
<template>
  <input v-model="inputVal" type="text" placeholder="Enter birth date" @input="(e) => inputVal = useBirthFormatter('/', e)">
</template>
```

## Use-cases

Call it with a separator and the JavaScript input event when the user types a birth date; it returns the formatted birth date string.
