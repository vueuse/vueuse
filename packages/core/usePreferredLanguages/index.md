---
category: Browser
---

# usePreferredLanguages

> Reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages). It provides web developers with information about the user's preferred languages. For example, this may be useful to adjust the language of the user interface based on the user's preferred languages in order to provide better experience.

## Usage

```js
import { usePreferredLanguages } from '@vueuse/core'

const languages = usePreferredLanguages()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive Navigator Languages.
 *
 * @see   {@link https://vueuse.js.org/usePreferredLanguages}
 * @param options
 */
export declare function usePreferredLanguages(
  options?: ConfigurableWindow
): Ref<readonly string[]>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/usePreferredLanguages/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/usePreferredLanguages/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/usePreferredLanguages/index.md)


<!--FOOTER_ENDS-->