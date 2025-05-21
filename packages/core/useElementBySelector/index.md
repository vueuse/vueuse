---
category: Elements
---

# useElementBySelector

Basic element selector utility. [querySelector MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector).

::: warning
Use this sparingly. It is not intended for selecting elements within your own component — use [Vue's built-in template refs](https://vuejs.org/guide/essentials/template-refs.html#template-refs) for that.
:::

## Usage

```ts
import { useElementBySelector } from '@vueuse/core'

const el = useElementBySelector('body')
```
