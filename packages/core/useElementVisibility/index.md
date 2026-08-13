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

const target = useTemplateRef('target')
const targetIsVisible = useElementVisibility(target)

const target2 = useTemplateRef('target2')
const targetVisibilityController = useElementVisibility(target2, { controls: true })
</script>

<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>

  <div ref="target2">
    <h1>Hi there</h1>
  </div>
</template>
```

### rootMargin

If you wish to trigger your callback sooner before the element is fully visible, you can use
the `rootMargin` option (See [MDN IntersectionObserver/rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)).

```ts
import { useElementVisibility } from '@vueuse/core'
// ---cut---
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

### controls

By default `useElementVisibility` returns a `ShallowRef<boolean>`. Set `controls: true` to receive the visibility ref together with the controls of the underlying `useIntersectionObserver`:

```ts
import { useElementVisibility } from '@vueuse/core'
// ---cut---
const { isVisible, isActive, pause, resume, stop, isSupported } = useElementVisibility(target, {
  controls: true,
})
```

| State         | Type                   | Description                                                                                                                  |
| ------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `isVisible`   | `ShallowRef<boolean>`  | Whether the target is currently visible in the viewport.                                                                     |
| `isActive`    | `ShallowRef<boolean>`  | Whether the observer is currently running. Turns `false` once the observer is stopped, for example after `once: true` fires. |
| `isSupported` | `ComputedRef<boolean>` | Whether the `IntersectionObserver` API is available.                                                                         |
| `pause`       | `() => void`           | Pause observing and set `isActive` to `false`.                                                                               |
| `resume`      | `() => void`           | Resume observing.                                                                                                            |
| `stop`        | `() => void`           | Stop observing permanently.                                                                                                  |

With `once: true`, read `isActive` to tell whether tracking has already stopped after the element first became visible:

```ts
import { useElementVisibility } from '@vueuse/core'
// ---cut---
const { isVisible, isActive } = useElementVisibility(target, {
  controls: true,
  once: true,
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

const target = useTemplateRef('target')
const isVisible = shallowRef(false)

function onElementVisibility(state) {
  isVisible.value = state
}

const target2 = useTemplateRef('target2')
const isVisible2 = shallowRef(false)

function onElementVisibilityWithControls(state) {
  isVisible2.value = state.isVisible.value
  if (state.isVisible.value) {
    state.stop()
  }
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

  <!-- with controls -->
  <div ref="target2">
    <div v-element-visibility="[onElementVisibilityWithControls, { controls: true }]">
      {{ isVisible2 ? 'inside' : 'outside' }}
    </div>
  </div>
</template>
```
