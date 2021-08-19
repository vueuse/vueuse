---
category: Component
---

# tryOnScopeDispose

Safe `onScopeDispose`. Call `onScopeDispose()` if it's inside a effect scope lifecycle, if not, do nothing

## Usage

```js
import { tryOnScopeDispose } from '@vueuse/core'

tryOnScopeDispose(() => {

})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Call onScopeDispose() if it's inside a effect scope lifecycle, if not, do nothing
 *
 * @param fn
 */
export declare function tryOnScopeDispose(fn: Fn): boolean
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/shared/tryOnScopeDispose/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/shared/tryOnScopeDispose/index.md)


<!--FOOTER_ENDS-->
