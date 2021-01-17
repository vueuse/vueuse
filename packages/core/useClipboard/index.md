---
category: Browser
---

# useClipboard

> Reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API). Provides the ability to respond to clipboard commands (cut, copy, and paste) as well as to asynchronously read from and write to the system clipboard. Access to the contents of the clipboard is gated behind the Permissions API without user permission, reading or altering the clipboard contents is not permitted.

## Usage

```js
import { useClipboard } from '@vueuse/core'

const { text, copy, isSupported } = useClipboard()
```

| State | Type     | Description                        |
| ----- | -------- | ---------------------------------- |
| isSupported  | `boolean` | the current environment support Clipboard API or not. |
| text  | `string` | the current text in the clipboard. |

| Method            | Description                                  |
| -------------------- | -------------------------------------------- |
| `copy(str: string)` | Writes the given string it in the clipboard. |


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive Clipboard API.
 *
 * @see   {@link https://vueuse.js.org/useClipboard}
 * @param options
 */
export declare function useClipboard({
  navigator,
}?: ConfigurableNavigator): {
  isSupported: boolean | undefined
  text: Ref<string>
  copy: (txt: string) => Promise<void>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/useClipboard/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/useClipboard/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/useClipboard/index.md)


<!--FOOTER_ENDS-->