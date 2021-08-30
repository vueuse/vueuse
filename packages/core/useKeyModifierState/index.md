---
category: Sensors
---

# useKeyModifierState

Reactive [Modifier State](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState). Tracks state of any of the [supported modifiers](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState#browser_compatibility) - see Browser Compatibility notes.

## Usage

```ts
import { useKeyModifierState } from '@vueuse/core'

const capsLockState = useKeyModifierState('CapsLock')

console.log(capsLockState)
// null if no events yet
// true / false afterwards
```

## Events

You can customise which events will prompt the state to update. By default, these are `mouseup`, `mousedown`, `keyup`, `keydown`. In order to customise these events:

```ts
import { useKeyModifierState } from '@vueuse/core'

const capsLockState = useKeyModifierState('CapsLock', { events: ['mouseup', 'mousedown'] })

console.log(capsLockState) // null

// Caps Lock turned on with key press
console.log(capsLockState) // null

// Mouse button clicked
console.log(capsLockState) // true
```
