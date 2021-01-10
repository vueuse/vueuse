---
category: Browser
---

# useEventListener

> Use EventListener with ease. Register using [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) on mounted, and [removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) automatically on unmounted.

## Usage

```js
import { useEventListener } from '@vueuse/core'

useEventListener('mousemove', (evt) => { console.log(evt) })
```

Custom Event Target

```ts
useEventListener(document, 'visibilitychange', (evt) => { console.log(evt) })
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
interface InferEventTarget<Events> {
  addEventListener(event: Events, fn?: any, options?: any): any
  removeEventListener(event: Events, fn?: any, options?: any): any
}
export declare type WindowEventName = keyof WindowEventMap
export declare type DocumentEventName = keyof DocumentEventMap
/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 1: Omitted Window target
 *
 * @see   {@link https://vueuse.js.org/useEventListener}
 * @param event
 * @param listener
 * @param options
 */
export declare function useEventListener<E extends keyof WindowEventMap>(
  event: E,
  listener: (this: Window, ev: WindowEventMap[E]) => any,
  options?: boolean | AddEventListenerOptions
): Fn
/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 2: Explicitly Window target
 *
 * @see   {@link https://vueuse.js.org/useEventListener}
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export declare function useEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: E,
  listener: (this: Window, ev: WindowEventMap[E]) => any,
  options?: boolean | AddEventListenerOptions
): Fn
/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 3: Explicitly Document target
 *
 * @see   {@link https://vueuse.js.org/useEventListener}
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export declare function useEventListener<E extends keyof DocumentEventMap>(
  target: Document,
  event: E,
  listener: (this: Document, ev: DocumentEventMap[E]) => any,
  options?: boolean | AddEventListenerOptions
): Fn
/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 4: Custom event target with event type infer
 *
 * @see   {@link https://vueuse.js.org/useEventListener}
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export declare function useEventListener<Names extends string>(
  target: InferEventTarget<Names>,
  event: Names,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): Fn
/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 5: Custom event target fallback
 *
 * @see   {@link https://vueuse.js.org/useEventListener}
 * @param target
 * @param event
 * @param listener
 * @param options
 */
export declare function useEventListener(
  target: EventTarget,
  event: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): Fn
export {}
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useEventListener/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useEventListener/index.md)


<!--FOOTER_ENDS-->