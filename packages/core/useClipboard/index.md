# useClipboard

> Reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API). Provides the ability to respond to clipboard commands (cut, copy, and paste) as well as to asynchronously read from and write to the system clipboard. Access to the contents of the clipboard is gated behind the Permissions API without user permission, reading or altering the clipboard contents is not permitted.

## Usage

```js
import { useClipboard } from '@vueuse/core'

const { text, copy, supported } = useClipboard()
```

| State | Type     | Description                        |
| ----- | -------- | ---------------------------------- |
| supported  | `boolean` | the current environment support Clipboard API or not. |
| text  | `string` | the current text in the clipboard. |

| Method            | Description                                  |
| -------------------- | -------------------------------------------- |
| `copy(str: string)` | Writes the given string it in the clipboard. |
