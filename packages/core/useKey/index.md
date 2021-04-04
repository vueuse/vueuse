---
category: Sensors
---

# useKey
Listen for keyboard keys being used.

## Usage

```js
import { useKey } from '@vueuse/core'

useKey('ArrowDown', (e) => {
  e.preventDefault()
})
```

Custom Event Target

```js
useKey(document, 'ArrowDown', (e) => {
  e.preventDefault()
})
```

Custom Keyboard Event
```js
useKey('ArrowDown', (e) => {
  e.preventDefault()
}, 'keyUp')
```

## Type Declarations

```typescript
export type KeyPredicate = (event: KeyboardEvent) => boolean
export type KeyFilter = null | undefined | string | ((event: KeyboardEvent) => boolean)
export type Handler = (event: KeyboardEvent) => void
export type EventType = 'keydown' | 'keypress' | 'keyup'

export function useKey(
  target: MaybeRef<EventTarget | null | undefined>,
  key: KeyFilter,
  handler: Handler,
  event?: EventType,
  options?: boolean | AddEventListenerOptions
): Fn

export function useKey(
  key: KeyFilter,
  handler: Handler,
  event?: EventType,
  options?: boolean | AddEventListenerOptions
): Fn
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useKey/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useKey/index.md)

<!--FOOTER_ENDS-->
