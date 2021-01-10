---
category: Animation
---

# useInterval

> Reactive counter increases on every interval

## Usage

```js {4}
import { useInterval } from '@vueuse/core'

// count will increase every 200ms
const { counter } = useInterval(200)
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare function useInterval(
  interval?: number,
  immediate?: boolean
): {
  stop: Fn
  start: Fn
  isActive: Ref<boolean>
  pause: Fn
  resume: Fn
  counter: Ref<number>
}
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/shared/useInterval/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/shared/useInterval/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/shared/useInterval/index.md)


<!--FOOTER_ENDS-->