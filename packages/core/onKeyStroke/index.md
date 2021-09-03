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

### Custom Event Target

```js
onKeyStroke('A', (e) => {
  console.log('Key A pressed on document')
}, { target: document })
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


## Alias

- `onKeyDown` - alias for `onKeyStroke(key, handler, {eventName: 'keydown'})`
- `onKeyPressed` - alias for `onKeyStroke(key, handler, {eventName: 'keypress'})`
- `onKeyUp` -  alias for `onKeyStroke(key, handler, {eventName: 'keyup'})`
