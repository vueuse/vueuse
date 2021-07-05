---
category: Component
---

# computedInject

Combine computed and inject

## Usage

In Provider Component
```ts
import { InjectionKey, provide, Ref, ref } from 'vue-demi';

export const ArrayKey: InjectionKey<Ref<{ key: number, value: string }[]>> = Symbol()

const array = ref([{ key: 1, value: '1' }, { key: 2, value: '2' }, { key: 3, value: '3' }])

provide(ArrayKey, array)
```

In Receiver Component
```ts
import { computedInject } from '@vueuse/core'

import { ArrayKey } from "./provider"

const computedArray = computedInject(ArrayKey, (source) => {
  const arr = [...source.value]
  arr.unshift({ key: 0, value: 'all' })
  return arr
})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare type ComputedInjectGetter<T, K> = (
  source: T | undefined,
  ctx?: any
) => K
export declare type ComputedInjectGetterWithDefault<T, K> = (
  source: T,
  ctx?: any
) => K
export declare type ComputedInjectSetter<T> = (v: T) => void
export interface WritableComputedInjectOptions<T, K> {
  get: ComputedInjectGetter<T, K>
  set: ComputedInjectSetter<K>
}
export interface WritableComputedInjectOptionsWithDefault<T, K> {
  get: ComputedInjectGetterWithDefault<T, K>
  set: ComputedInjectSetter<K>
}
export declare function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  getter: ComputedInjectGetter<T, K>
): ComputedRef<K | undefined>
export declare function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  options: WritableComputedInjectOptions<T, K>
): ComputedRef<K | undefined>
export declare function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  getter: ComputedInjectGetterWithDefault<T, K>,
  defaultSource: T,
  treatDefaultAsFactory?: false
): ComputedRef<K>
export declare function computedInject<T, K = any>(
  key: InjectionKey<T> | string,
  options: WritableComputedInjectOptionsWithDefault<T, K>,
  defaultSource: T | (() => T),
  treatDefaultAsFactory: true
): ComputedRef<K>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/computedInject/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/computedInject/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/computedInject/index.md)


<!--FOOTER_ENDS-->
