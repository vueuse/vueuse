---
category: Utilities
---

# get

> Shorthand for accessing `ref.value`

## Usage

```ts
import { get } from '@vueuse/core'

const a = ref(42)

console.log(get(a)) // 42
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Shorthand for accessing `ref.value`
 */
export declare function get<T>(ref: Ref<T>): T
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/shared/get/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/shared/get/index.md)


<!--FOOTER_ENDS-->
