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

You can customise which events will prompt the state to update. By default, these are mouseup, mousedown, keyup, keydown. In order to customise these events:

```ts
import { useKeyModifierState } from '@vueuse/core'

const capsLockStateDefault = useKeyModifierState('CapsLock')
const capsLockStateCustom = useKeyModifierState('CapsLock', { events: ['mouseup', 'mousedown'] })

console.log(capsLockStateDefault) // null
console.log(capsLockStateCustom) // null

// User turns on capsLock

console.log(capsLockStateDefault) // true
console.log(capsLockStateCustom) // null
```
