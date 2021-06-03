---
category: Watch
---

# definedWatch

Defined watch

## Usage

Similar to `watch`, but only gets triggered when the value is defined.

```ts
import { definedWatch } from '@vueuse/core'

definedWatch(
  source,
  () => { console.log('changed!') }
)
```

It's essentially a shorthand for the following code:

```ts
import { watchWithFilter, definedFilter } from '@vueuse/core'

watchWithFilter(
  source,
  () => { console.log('changed!') },
  {
    eventFilter: definedFilter(),
  }
)
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface DefinedWatchOptions<Immediate>
  extends WatchOptions<Immediate> {}
export declare function definedWatch<
  T extends Readonly<WatchSource<unknown>[]>,
  Immediate extends Readonly<boolean> = false
>(
  sources: T,
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: DefinedWatchOptions<Immediate>
): WatchStopHandle
export declare function definedWatch<
  T,
  Immediate extends Readonly<boolean> = false
>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: DefinedWatchOptions<Immediate>
): WatchStopHandle
export declare function definedWatch<
  T extends object,
  Immediate extends Readonly<boolean> = false
>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: DefinedWatchOptions<Immediate>
): WatchStopHandle
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/shared/definedWatch/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/shared/definedWatch/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/shared/definedWatch/index.md)


<!--FOOTER_ENDS-->
