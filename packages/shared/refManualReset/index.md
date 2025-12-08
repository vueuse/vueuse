---
category: Reactivity
---

# refManualReset

Create a ref with manual reset functionality.

## Usage

```ts
import { refManualReset } from '@vueuse/core'

const message = refManualReset('default message')

message.value = 'message has set'

message.reset()

console.log(message.value) // 'default message'
```

Since `refManualReset` is implemented using `customRef`, it does **not** provide deep reactivity by default.  
If you need nested properties to be reactive, wrap the initial value with `reactive`:

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import { refManualReset } from '@vueuse/core'

const form = refManualReset(reactive({
  user: {
    name: "Tom",
    profile: { age: 18 },
  },
}))

function increaseAge() {
  // Deep mutations will now update the UI
  form.value.user.profile.age++
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-screen h-screen">
    <div>Age: {{ form.user.profile.age }}</div>
    <button @click="increaseAge">Add age</button>
  </div>
</template>

