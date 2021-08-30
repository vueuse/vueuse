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
// null if no keydown or keyup events yet.
// true / false afterwards
```
