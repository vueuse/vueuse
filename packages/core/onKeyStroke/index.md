---
category: Sensors
---

# onKeyStroke

Listen for keyboard key being stroked.

## Usage

```js
import { onKeyStroke } from '@vueuse/core'

onKeyStroke('ArrowDown', (e) => {
  e.preventDefault()
})
```

See [this table](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) for all key codes.

### Listen To Multiple Keys

```js
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

```js
onKeyStroke('A', (e) => {
  console.log('Key A pressed on document')
}, { target: document })
```

### Ignore Repeated Strokes

The callback will trigger only once when pressing `A` and **hold down**.

```js
// use `repeat` option
onKeyStroke('A', (e) => {
  console.log('Key A pressed')
}, { repeat: false })

// or use `onKeyStrokeOnce` shorthand
onKeyStrokeOnce('A', (e) => {
  console.log('Key A pressed')
})
```

Reference: [KeyboardEvent.repeat](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)

## Directive Usage

```html
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

```js
onKeyStroke('Shift', (e) => {
  console.log('Shift key up')
}, { eventName: 'keyup' })
```

Or

```js
onKeyUp('Shift', () => console.log('Shift key up'))
```


## Shorthands

- `onKeyStrokeOnce` - does the same as `onKeyStroke` while ignoring [repeated strokes](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
- `onKeyDown` - alias for `onKeyStroke(key, handler, {eventName: 'keydown'})`
- `onKeyPressed` - alias for `onKeyStroke(key, handler, {eventName: 'keypress'})`
- `onKeyUp` -  alias for `onKeyStroke(key, handler, {eventName: 'keyup'})`
