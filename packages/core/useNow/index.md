---
category: Animation
---

# useNow

Reactive current Date instance.

## Usage

```js
import { useNow } from '@vueuse/core'

const { now, pause, resume } = useNow()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface UseNowOptions {
  /**
   * Update interval, or use requestAnimationFrame
   *
   * @default requestAnimationFrame
   */
  interval?: "requestAnimationFrame" | number
}
/**
 * Reactive current timestamp.
 *
 * @see https://vueuse.org/useNow
 * @param options
 */
export declare function useNow(
  options?: UseNowOptions
): {
  isActive: Ref<boolean>
  pause: Fn
  resume: Fn
  now: Ref<
    {
      toString: () => string
      toDateString: () => string
      toTimeString: () => string
      toLocaleString: {
        (): string
        (
          locales?: string | string[] | undefined,
          options?: Intl.DateTimeFormatOptions | undefined
        ): string
      }
      toLocaleDateString: {
        (): string
        (
          locales?: string | string[] | undefined,
          options?: Intl.DateTimeFormatOptions | undefined
        ): string
      }
      toLocaleTimeString: {
        (): string
        (
          locales?: string | string[] | undefined,
          options?: Intl.DateTimeFormatOptions | undefined
        ): string
      }
      valueOf: () => number
      getTime: () => number
      getFullYear: () => number
      getUTCFullYear: () => number
      getMonth: () => number
      getUTCMonth: () => number
      getDate: () => number
      getUTCDate: () => number
      getDay: () => number
      getUTCDay: () => number
      getHours: () => number
      getUTCHours: () => number
      getMinutes: () => number
      getUTCMinutes: () => number
      getSeconds: () => number
      getUTCSeconds: () => number
      getMilliseconds: () => number
      getUTCMilliseconds: () => number
      getTimezoneOffset: () => number
      setTime: (time: number) => number
      setMilliseconds: (ms: number) => number
      setUTCMilliseconds: (ms: number) => number
      setSeconds: (sec: number, ms?: number | undefined) => number
      setUTCSeconds: (sec: number, ms?: number | undefined) => number
      setMinutes: (
        min: number,
        sec?: number | undefined,
        ms?: number | undefined
      ) => number
      setUTCMinutes: (
        min: number,
        sec?: number | undefined,
        ms?: number | undefined
      ) => number
      setHours: (
        hours: number,
        min?: number | undefined,
        sec?: number | undefined,
        ms?: number | undefined
      ) => number
      setUTCHours: (
        hours: number,
        min?: number | undefined,
        sec?: number | undefined,
        ms?: number | undefined
      ) => number
      setDate: (date: number) => number
      setUTCDate: (date: number) => number
      setMonth: (month: number, date?: number | undefined) => number
      setUTCMonth: (month: number, date?: number | undefined) => number
      setFullYear: (
        year: number,
        month?: number | undefined,
        date?: number | undefined
      ) => number
      setUTCFullYear: (
        year: number,
        month?: number | undefined,
        date?: number | undefined
      ) => number
      toUTCString: () => string
      toISOString: () => string
      toJSON: (key?: any) => string
    } & {
      [Symbol.toPrimitive]: {
        (hint: "default"): string
        (hint: "string"): string
        (hint: "number"): number
        (hint: string): string | number
      }
    }
  >
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useNow/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useNow/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useNow/index.md)


<!--FOOTER_ENDS-->
