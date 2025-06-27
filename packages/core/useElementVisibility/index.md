---
category: Elements
---

# useElementVisibility

Tracks the visibility of an element within the viewport.

## Usage

```vue
<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const target = useTemplateRef<HTMLDivElement>('target')
const targetIsVisible = useElementVisibility(target)
</script>

<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>
</template>
```

### rootMargin

If you wish to trigger your callback sooner before the element is fully visible, you can use
the `rootMargin` option (See [MDN IntersectionObserver/rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)).

```ts
const targetIsVisible = useElementVisibility(target, {
  rootMargin: '0px 0px 100px 0px',
})
```

### threshold

If you want to control the percentage of the visibility required to update the value, you can use the `threshold` option (See [MDN IntersectionObserver/threshold](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#threshold)).

```ts
const targetIsVisible = useElementVisibility(target, {
  threshold: 1.0, // 100% visible
})
```

## Component Usage

```vue
<template>
  <UseElementVisibility v-slot="{ isVisible }">
    Is Visible: {{ isVisible }}
  </UseElementVisibility>
</template>
```

## Directive Usage

```vue
<script setup lang="ts">
import { vElementVisibility } from '@vueuse/components'
import { shallowRef, useTemplateRef } from 'vue'

const target = useTemplateRef<HTMLDivElement>('target')
const isVisible = shallowRef(false)

function onElementVisibility(state) {
  isVisible.value = state
}
</script>

<template>
  <div v-element-visibility="onElementVisibility">
    {{ isVisible ? 'inside' : 'outside' }}
  </div>

  <!-- with options -->
  <div ref="target">
    <div v-element-visibility="[onElementVisibility, { scrollTarget: target }]">
      {{ isVisible ? 'inside' : 'outside' }}
    </div>
  </div>
</template>
```
