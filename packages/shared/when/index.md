---
category: Watch
---

# when

> Promised one-time watch for ref changes

## Usage

#### Wait for some async data to be ready

```js
import { when, useAsyncState } from '@vueuse/core'

const { state, ready } = useAsyncState(
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(t => t.json()),
  {},
)

;(async() => {
  await when(ready).toBe(true)

  console.log(state) // state is now ready!
})()
```

#### Wait for custom conditions

> You can use `invoke` to call the async function.

```js
import { when, useCounter, invoke } from '@vueuse/core'

const { count } = useCounter()

invoke(async() => {
  await when(count).toMatch(v => v > 7)

  alert('Counter is now larger than 7!')
})
```

#### Timeout

```ts
// will be resolve when ref.value === true or 1000ms passed
await when(ref).toBe(true, { timeout: 1000 })

// will throw if timeout
try {
  await when(ref).toBe(true, { timeout: 1000, throwOnTimeout: true })
  // ref.value === true
} catch(e) {
  // timeout
}
```

#### More Examples

```ts
await when(ref).toBe(true)
await when(ref).toMatch(v => v > 10 && v < 100)
await when(ref).changed()
await when(ref).changedTimes(10)
await when(ref).toBeTruthy()
await when(ref).toBeNull()

await when(ref).not.toBeNull()
await when(ref).not.toBeTruthy()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface WhenToMatchOptions {
  /**
   * Milseconds timeout for promise to resolve/reject if the when condition does not meet.
   * 0 for never timed out
   *
   * @default 0
   */
  timeout?: number
  /**
   * Reject the promise when timeout
   *
   * @default false
   */
  throwOnTimeout?: boolean
  /**
   * `flush` option for internal watch
   *
   * @default 'sync'
   */
  flush?: WatchOptions["flush"]
  /**
   * `deep` option for internal watch
   *
   * @default 'false'
   */
  deep?: WatchOptions["deep"]
}
export interface BaseWhenInstance<T> {
  toMatch(
    condition: (v: T) => boolean,
    options?: WhenToMatchOptions
  ): Promise<void>
  changed(options?: WhenToMatchOptions): Promise<void>
  changedTimes(n?: number, options?: WhenToMatchOptions): Promise<void>
}
export interface ValueWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: ValueWhenInstance<T>
  toBe<P = T>(
    value: MaybeRef<T | P>,
    options?: WhenToMatchOptions
  ): Promise<void>
  toBeTruthy(options?: WhenToMatchOptions): Promise<void>
  toBeNull(options?: WhenToMatchOptions): Promise<void>
  toBeUndefined(options?: WhenToMatchOptions): Promise<void>
  toBeNaN(options?: WhenToMatchOptions): Promise<void>
}
export interface ArrayWhenInstance<T> extends BaseWhenInstance<T> {
  readonly not: ArrayWhenInstance<T>
  toContains(
    value: MaybeRef<ElementOf<ShallowUnwrapRef<T>>>,
    options?: WhenToMatchOptions
  ): Promise<void>
}
export declare function when<T extends unknown[]>(r: T): ArrayWhenInstance<T>
export declare function when<T extends Ref<unknown[]>>(
  r: T
): ArrayWhenInstance<T>
export declare function when<T>(r: WatchSource<T>): ValueWhenInstance<T>
export declare function when<T>(r: T): ValueWhenInstance<T>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/shared/when/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/shared/when/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/shared/when/index.md)


<!--FOOTER_ENDS-->