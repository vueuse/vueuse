---
category: Utilities
---

# not

`NOT` condition for ref.

## Usage

```ts
import { not } from '@vueuse/core'

const a = ref(true)

whenever(not(a), () => {
  console.log('a is now falsy!')
})
```

## Related Functions

- `and`
- `or`
- `whenever`

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare function set<T>(ref: Ref<T>, value: T): void
export declare function set<O extends object, K extends keyof O>(
  target: O,
  key: K,
  value: O[K]
): void
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/shared/set/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/shared/set/index.md)


<!--FOOTER_ENDS-->
