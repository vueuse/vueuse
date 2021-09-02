---
category: Sensors
---

# useKeyModifier

Reactive [Modifier State](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState). Tracks state of any of the [supported modifiers](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState#browser_compatibility) - see Browser Compatibility notes.

## Usage

```ts
import { useKeyModifier } from '@vueuse/core'

const capsLockState = useKeyModifier('CapsLock')

console.log(capsLockState)
// null if no events yet
// true / false afterwards
```

## Events

You can customize which events will prompt the state to update. By default, these are `mouseup`, `mousedown`, `keyup`, `keydown`. To customize these events:

```ts
import { useKeyModifier } from '@vueuse/core'

const capsLockState = useKeyModifier('CapsLock', { events: ['mouseup', 'mousedown'] })

console.log(capsLockState) // null

// Caps Lock turned on with key press
console.log(capsLockState) // null

// Mouse button clicked
console.log(capsLockState) // true
```
