---
category: Sensors
---

# onClickOutside

Listen for clicks outside of an element. Useful for modal or dropdown.

## Usage

```vue
<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const target = useTemplateRef('target')

onClickOutside(target, event => console.log(event))
</script>

<template>
  <div ref="target">
    Hello world
  </div>
  <div>Outside element</div>
</template>
```

If you need more control over triggering the handler, you can use the `controls` option.

```ts
const { cancel, trigger } = onClickOutside(
  modalRef,
  (event) => {
    modal.value = false
  },
  { controls: true },
)

useEventListener('pointermove', (e) => {
  cancel()
  // or
  trigger(e)
})
```

If you want to ignore certain elements, you can use the `ignore` option. Provide the elements to ignore as an array of Refs or CSS Selectors.

```ts
const ignoreElRef = useTemplateRef('ignoreEl')
const ignoreElSelector = '.ignore-el'

onClickOutside(
  target,
  event => console.log(event),
  { ignore: [ignoreElRef, ignoreElSelector] },
)
```

## Component Usage

```vue
<template>
  <OnClickOutside :options="{ ignore: [/* ... */] }" @trigger="count++">
    <div>
      Click Outside of Me
    </div>
  </OnClickOutside>
</template>
```

## Directive Usage

```vue
<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { shallowRef } from 'vue'

const modal = shallowRef(false)
function closeModal() {
  modal.value = false
}
</script>

<template>
  <button @click="modal = true">
    Open Modal
  </button>
  <div v-if="modal" v-on-click-outside="closeModal">
    Hello World
  </div>
</template>
```

You can also set the handler as an array to set the configuration items of the instruction.

```vue
<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { shallowRef, useTemplateRef } from 'vue'

const modal = shallowRef(false)

const ignoreElRef = useTemplateRef('ignoreEl')

const onClickOutsideHandler = [
  (ev) => {
    console.log(ev)
    modal.value = false
  },
  { ignore: [ignoreElRef] },
]
</script>

<template>
  <button @click="modal = true">
    Open Modal
  </button>

  <div ref="ignoreElRef">
    click outside ignore element
  </div>

  <div v-if="modal" v-on-click-outside="onClickOutsideHandler">
    Hello World
  </div>
</template>
```
