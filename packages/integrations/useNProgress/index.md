---
category: '@Integrations'
---

# useNProgress

> Reactive wrapper for [`nprogress`](https://github.com/rstacruz/nprogress)

## Usage

```js {6}
import { useNProgress } from '@vueuse/integrations'

const { isLoading } = useNProgress()

function toggle() {
  isLoading.value = !isLoading.value
}
```

### Passing a progress percentage

You can pass a percentage to indicate where the bar should start from.

```js {3}
import { useNProgress } from '@vueuse/integrations'

const { progress } = useNProgress(0.5)

function done() {
  progress.value = 1.0
}
```

> To change the progress percentage, set `progress.value = n`, where n is a number between 0..1.

### Customization

Just edit [nprogress.css](http://ricostacruz.com/nprogress/nprogress.css) to your liking. Tip: you probably only want to find and replace occurrences of #29d.

You can [configure](https://github.com/rstacruz/nprogress#configuration) it by passing an object as a second parameter.

```js {4}
import { useNProgress } from '@vueuse/integrations'

useNProgress(null, {
  minimum: 0.1,
  // ...
})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive progress bar.
 *
 * @see   {@link https://vueuse.js.org/useNProgress}
 * @param currentProgress
 * @param options
 */
export declare function useNProgress(
  currentProgress?: MaybeRef<number | null | undefined>,
  options?: NProgressOptions | undefined
): {
  isLoading: Ref<boolean | null>
  progress: Ref<number | null | undefined>
  start: () => void
  done: () => void
  remove: () => void
}
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/integrations/useNProgress/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/integrations/useNProgress/index.md)


<!--FOOTER_ENDS-->