---
category: Utilities
---

# and

`AND` condition for refs.

## Usage

```ts
import { and } from '@vueuse/core'

const a = ref(true)
const b = ref(false)

whenever(and(a, b), () => {
  console.log('both a and b are now truthy!')
})
```

## Related Functions

- `or`
- `not`
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
