---
category: Sensors
---

# onKeyStroke
Listen for keyboard keys being stroked.

## Usage

```js
import { onKeyStroke } from '@vueuse/core'

onKeyStroke('ArrowDown', (e) => {
  e.preventDefault()
})
```

Custom Event Target

```js
onKeyStroke('ArrowDown', (e) => {
  e.preventDefault()
}, { target: document })
```

Custom Keyboard Event
```js
onKeyStroke('ArrowDown', (e) => {
  e.preventDefault()
}, { eventName: 'keyUp' })
```

## Alias
- `onKeyDown`: alias for `onKeyStroke(key, handler, {eventName: 'keydown'})`
- `onKeyPressed`: alias for `onKeyStroke(key, handler, {eventName: 'keypress'})`
- `onKeyUp`: alias for `onKeyStroke(key, handler, {eventName: 'keyup'})`
## Type Declarations

```typescript
export type KeyPredicate = (event: KeyboardEvent) => boolean
export type KeyFilter = null | undefined | string | KeyPredicate
export type KeyStrokeEventName = 'keydown' | 'keypress' | 'keyup'
export type KeyStrokeOptions = {
  eventName?: KeyStrokeEventName
  target?: MaybeRef<EventTarget>
  passive?: boolean
}

export function onKeyStroke(
  key: KeyFilter,
  handler: (event: KeyboardEvent) => void,
  options?: KeyStrokeOptions
): Fn

export function onKeyDown(
  key: KeyFilter,
  handler: (event: KeyboardEvent) => void,
  options?: Omit<KeyStrokeOptions, 'eventName'>
): Fn

export function onKeyPressed(
  key: KeyFilter,
  handler: (event: KeyboardEvent) => void,
  options?: Omit<KeyStrokeOptions, 'eventName'>
): Fn

export function onKeyUp(
  key: KeyFilter,
  handler: (event: KeyboardEvent) => void,
  options?: Omit<KeyStrokeOptions, 'eventName'>
): Fn
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/onKeyStroke/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/onKeyStroke/index.md)

<!--FOOTER_ENDS-->
