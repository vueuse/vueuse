---
category: Sensors
---

# onKeyStroke

Listen for keyboard keystrokes.

## Usage

```ts
import { onKeyStroke } from '@vueuse/core'

onKeyStroke('ArrowDown', (e) => {
  e.preventDefault()
})
```

See [this table](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) for all key codes.

### Listen To Multiple Keys

```ts
import { onKeyStroke } from '@vueuse/core'

onKeyStroke(['s', 'S', 'ArrowDown'], (e) => {
  e.preventDefault()
})

// listen to all keys by [true / skip the keyDefine]
onKeyStroke(true, (e) => {
  e.preventDefault()
})
onKeyStroke((e) => {
  e.preventDefault()
})
```

### Custom Event Target

```ts
import { onKeyStroke } from '@vueuse/core'
// ---cut---
onKeyStroke('A', (e) => {
  console.log('Key A pressed on document')
}, { target: document })
```

### Ignore Repeated Events

The callback will trigger only once when pressing `A` and **hold down**.

```ts
import { onKeyStroke } from '@vueuse/core'
// ---cut---
// use `autoRepeat` option
onKeyStroke('A', (e) => {
  console.log('Key A pressed')
}, { dedupe: true })
```

Reference: [KeyboardEvent.repeat](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)

## Directive Usage

```vue
<script setup lang="ts">
import { vOnKeyStroke } from '@vueuse/components'

function onUpdate(e: KeyboardEvent) {
  // impl...
}
</script>

<template>
  <input v-on-key-stroke:c,v="onUpdate" type="text">
  <!-- with options -->
  <input v-on-key-stroke:c,v="[onUpdate, { eventName: 'keyup' }]" type="text">
</template>
```

### Custom Keyboard Event

```ts
import { onKeyStroke } from '@vueuse/core'
// ---cut---
onKeyStroke('Shift', (e) => {
  console.log('Shift key up')
}, { eventName: 'keyup' })
```

Or

```ts
import { onKeyUp } from '@vueuse/core'
// ---cut---
onKeyUp('Shift', () => console.log('Shift key up'))
```

## Shorthands

- `onKeyDown` - alias for `onKeyStroke(key, handler, {eventName: 'keydown'})`
- `onKeyPressed` - alias for `onKeyStroke(key, handler, {eventName: 'keypress'})`
- `onKeyUp` - alias for `onKeyStroke(key, handler, {eventName: 'keyup'})`
